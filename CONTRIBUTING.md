# Contributing

To contribute:

* Install the [Gulp](http://gulpjs.com/) task runner.
* Create a feature or bugfix branch of master.
* Clone your branch.
* Run `$ node install` from the project's root folder.

Contributions are welcome as long provided the follow the guidelines outlined below.  Failure to satisfy all guidelines will result in rejection.

* All modifications must be made via pull request.

* This library is designed to be a drop-in replacement for the Couchnode module.  All functionality must be non-breaking extensions of the base Couchnode module.

* All updates must update the version number according to the [semver](http://semver.org/) guideline.

* All updates must include a description of the changes in the [Change Log](CHANGELOG.md).

* All changes to the core module code must include proper test coverage.  Tests must reach 100% code coverage.

* All commits to master must result in a successful build and test run.
