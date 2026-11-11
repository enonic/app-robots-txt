const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

function loadModule(relativePath, mocks) {
    const filename = path.join(__dirname, '../src/main/resources', relativePath);
    const exports = {};
    vm.runInNewContext(readFileSync(filename, 'utf8'), {
        exports,
        app: { name: 'com.enonic.app.robotstxt' },
        require(id) {
            assert.ok(Object.hasOwn(mocks, id), `Unexpected require: ${id}`);
            return mocks[id];
        },
    }, { filename });
    return exports;
}

function createFixture({ siteConfig, projectConfig, projectExists = true } = {}) {
    const calls = [];
    const utilLib = {
        forceArray(value) {
            return value == null ? [] : (Array.isArray(value) ? value : [value]);
        },
    };
    const robotsLib = loadModule('lib/robots.js', {
        '/lib/xp/content': {
            getSite({ key }) {
                calls.push(['getSite', key]);
                return siteConfig === undefined ? null : { data: { siteConfig } };
            },
        },
        '/lib/xp/project': {
            get({ id }) {
                calls.push(['getProject', id]);
                return projectExists ? { siteConfig: projectConfig } : null;
            },
        },
        './ctx': {
            executeInContext(project, branch, callback) {
                calls.push(['context', project, branch]);
                return callback();
            },
        },
        '/lib/util': utilLib,
    });
    const resolvers = loadModule('guillotine/resolvers/index.js', {
        '/lib/robots': robotsLib,
        '/lib/util': utilLib,
    });
    return {
        calls,
        robotsLib,
        resolve(context) {
            return resolvers.HeadlessCmsType_robotstxt_Resolver({
                localContext: { project: 'my-project', branch: 'draft', ...context },
            });
        },
    };
}

const projectRules = { groups: [{ userAgent: 'project-bot' }] };
const siteRules = { groups: [{ userAgent: 'site-bot' }] };
const appConfig = config => [{ applicationKey: 'com.enonic.app.robotstxt', config }];

for (const [name, context] of [
    ['absent', {}],
    ['null', { scopeKey: null }],
    ['root', { scopeKey: '/' }],
    ['root takes precedence over legacy site', { scopeKey: '/', siteKey: '/legacy-site' }],
]) {
    test(`${name} scope uses project configuration without a site lookup`, () => {
        const fixture = createFixture({ projectConfig: appConfig(projectRules) });
        assert.equal(fixture.resolve(context)._config, projectRules);
        assert.deepEqual(fixture.calls, [
            ['context', 'my-project', 'draft'],
            ['getProject', 'my-project'],
        ]);
    });
}

for (const [name, context, expectedKey] of [
    ['site', { scopeKey: '/site' }, '/site'],
    ['child in a site', { scopeKey: '/site/child' }, '/site/child'],
    ['scope takes precedence over legacy site', { scopeKey: '/site/child', siteKey: '/legacy-site' }, '/site/child'],
    ['legacy site', { siteKey: '/legacy-site' }, '/legacy-site'],
    ['null scope with legacy site', { scopeKey: null, siteKey: '/legacy-site' }, '/legacy-site'],
]) {
    test(`${name} uses the containing site's configuration`, () => {
        const fixture = createFixture({
            siteConfig: appConfig(siteRules),
            projectConfig: appConfig(projectRules),
        });
        assert.equal(fixture.resolve(context)._config, siteRules);
        assert.deepEqual(fixture.calls, [
            ['context', 'my-project', 'draft'],
            ['getSite', expectedKey],
        ]);
    });
}

test('content outside a site falls back to project configuration', () => {
    const fixture = createFixture({ projectConfig: appConfig(projectRules) });
    assert.equal(fixture.resolve({ scopeKey: '/outside' })._config, projectRules);
    assert.deepEqual(fixture.calls, [
        ['context', 'my-project', 'draft'],
        ['getSite', '/outside'],
        ['getProject', 'my-project'],
    ]);
});

test('a site without the robots app does not inherit project configuration', () => {
    const fixture = createFixture({ siteConfig: [], projectConfig: appConfig(projectRules) });
    assert.equal(fixture.resolve({ scopeKey: '/site' }), null);
    assert.deepEqual(fixture.calls, [
        ['context', 'my-project', 'draft'],
        ['getSite', '/site'],
    ]);
});

test('missing project preserves the empty source config fallback', () => {
    const fixture = createFixture({ projectExists: false });
    assert.equal(Object.keys(fixture.robotsLib.resolveSourceConfig('my-project', 'draft', null)).length, 0);
    assert.equal(fixture.resolve({ scopeKey: '/outside' }), null);
});
