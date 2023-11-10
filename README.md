# Robots.txt

This app allows you to set all fields for the robots.txt file.
This app will also add a [controller mapping](http://xp.readthedocs.io/en/6.5/developer/site/mappings/index.html#controller-mappings) to the path `robots.txt` on the root of any site it is added to.

## Headless
Headless sites can use the service to get the robots.txt file or data.
Service path `_/service/com.enonic.app.robotstxt/robotstxt`.
Accept header of `application/json` will return the data as json.

But be sure to check out [how robots.txt works](https://en.wikipedia.org/wiki/Robots_exclusion_standard) before typing away into the robots-field.

## Installation

Check Enonic Market for further details on installing apps in XP. You have multiple options. The easiest way is to just go to the Application admin tool inside Enonic XP and hit the "Install" button, now find this app and click "Install". Done!

To build the source manually, just download this repo (or use the [XP Toolbox "init-project"](http://xp.readthedocs.io/en/6.5/developer/projects/init.html)), and use the command ["gradlew deploy"](http://xp.readthedocs.io/en/6.5/developer/projects/build.html) in the terminal.

## Migrating from 1.1.0 to 2.0.0
The old configuration is not compatible with the new one, so you need to reconfigure the app.

Exampel 1.0.0 configuration
```
Sitemap: https://site.com/sitemap.xml
User-agent: *
Disallow:
```

Migrate this to the respective fields in the new configuration

Example:

`Useragent` = *

`Disallow` = ` `

`Sitemap` = `https://site.com/sitemap.xml`

Do this for all useragents you have in the old configuration.


## Releases and Compatibility

| Version | XP version |
| ------------- | ------------- |
| 2.0.0 | 7.12.0 |
| 1.1.0 | 7.0.0 |
| 1.0.0 | 6.7.0 |

## Changelog

### Version 2.0.0

* New app configuration
* Old configuration cant be used, so you need to reconfigure the app

### Version 1.1.0

* Compatibility with XP 7

### Version 1.0.0

* First release
