Playfully.org
=============

This project is the front-end, Angular.js-powered user experience for the
Playfully.org web site.



Installation
------------

Make sure you have Node.js installed.

1. git clone git@github.com:GlasslabGames/Playfully.org.git
2. cd Playfully.org
3. sudo npm -g install grunt-cli karma bower
4. sudo npm install
5. bower install
6. grunt watch


End-to-end testing
------------------

Playfully makes use of Protractor for end-to-end browser-based testing from a
user's perspective. Protractor relies on a local installation of Selenium,
which is run by a process called webdriver-manager. At the moment it expects
this to be available system wide. In order to ensure this, run these steps:

1. npm install -g protractor
2. Download http://selenium-release.storage.googleapis.com/2.41/selenium-server-standalone-2.41.0.jar (requires Java)
3. Run server with:  
>$ java -jar /path/to/selenium-server-standalone-2.41.0.jar
4. Launch tests with :
>$ grunt mocha



Text content and i18n
---------------------

Strings in the Playfully app have been extracted into a single file, located at
/src/assets/i18n/locale-en.json. This is to centralize text for possible future
CMSification, and to bake in internationalization support from the outset.

To add a new translation:

1. Copy the locale-en.json file, renaming to the appropriate language
   abbreviation.
2. Leaving all keys in the JSON file the same
3. Translate their associated values to the new language

To add new content:

1. Open locale-en.json
2. If it's an existing page, find its section by key (e.g.
   'home.about.section2'), and choose an appropriate extension for the content
   you're adding
3. Create the "key":"value" pair
4. In the page template, add an element with an ng-binding whose value looks
   like: data-ng-bind="'home.about.section2.yourContent' | translate" (the
   single quotes are important)




Testing Registration
====================

In order to test Edmodo registrations without having to create new Edmodo
users, the user can be deleted from the database. It may be necessary to
disable foreign keys first:

SET FOREIGN_KEY_CHECKS=0; -- to disable them
DELETE FROM GL_USER WHERE LOGIN_TYPE = 'edmodo';
SET FOREIGN_KEY_CHECKS=1; -- to re-enable them



joe+edmodo.teacher@instituteofplay.org
test

joeedmodostudent
test
code to register for class: vuebgk


