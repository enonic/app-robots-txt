# Robots.txt

Perhaps the smallest XP app yet? This app has one setting: A TextArea for the entire contents of your robots.txt file (added as an app setting on the sites it is added to). This app will also add a [controller mapping](http://xp.readthedocs.io/en/6.5/developer/site/mappings/index.html#controller-mappings) to the path `robots.txt` on the root of any site it is added to.

No other configurations needed. But be sure to check out [how robots.txt works](https://en.wikipedia.org/wiki/Robots_exclusion_standard) before typing away into the robots-field.

## Installation

Check Enonic Market for further details on installing apps in XP. You have multiple options. The easiest way is to just go to the Application admin tool inside Enonic XP and hit the "Install" button, now find this app and click "Install". Done!

To build the source manually, just download this repo (or use the [XP Toolbox "init-project"](http://xp.readthedocs.io/en/6.5/developer/projects/init.html)), and use the command ["gradlew deploy"](http://xp.readthedocs.io/en/6.5/developer/projects/build.html) in the terminal.

## Releases and Compatibility

| Version | XP version |
| ------------- | ------------- |
| 1.1.0 | 6.7.0 |
| 1.0.0 | 6.7.0 |

## Changelog

### Version 1.1.0

* Compatibility with XP 7

### Version 1.0.0

* First release
