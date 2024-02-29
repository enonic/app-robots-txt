# Robots.txt

This app allows you to set all fields for the robots.txt file.
This app will also add a [controller mapping](http://xp.readthedocs.io/en/6.5/developer/site/mappings/index.html#controller-mappings) to the path `robots.txt` on the root of any site it is added to.

## Installation

Check Enonic Market for further details on installing apps in XP. The easiest way to install is from the Application admin tool inside
Enonic XP: just search for this app and click "Install"!

To build the source manually, just download this repo or better yet use `enonic create -r app-robots-txt` CLI command.
And then build the source using `enonic project build` command from inside the project folder.

## Usage

The app adds a GET request handler to a site it is added to at `/robots.txt`.
To edit the robots.txt content, go to the app settings and fill in the fields.
Be sure to check out [how robots.txt works](https://en.wikipedia.org/wiki/Robots_exclusion_standard) if unsure what they mean.

> **TIP:** Supplying `application/json` value in `accept` header will return the data as json.

### Headless

Headless sites can use guillotine app to get the robots.txt file contents as data.
Following fields are added to the graphql schema by the app:

```graphql
query {
    guillotine {
        robotstxt {
            text
            rules {
                userAgent
                allow
                disallow
            }
            sitemap
        }
    }
}
```

## Upgrade notes

### 2.x to 3.x

Service `_/service/com.enonic.app.robotstxt/robotstxt` has been removed in favor of the graphql access for headless usage.

### 1.x to 2.x
The old configuration is not compatible with the new one, so you need to reconfigure the app.

Example 1.0.0 configuration
```
Sitemap: https://site.com/sitemap.xml
User-agent: *
Disallow:
```

Migrate this to the respective fields in the new form-based configuration

Example:

`Useragent` = *

`Disallow` = ` `

`Sitemap` = `https://site.com/sitemap.xml`

Do this for all useragents you have in the old configuration.
