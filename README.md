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
4. npm install
5. bower install
6. grunt watch


End-to-end testing
------------------

Playfully makes use of Protractor for end-to-end browser-based testing from a
user's perspective. Protractor relies on a local installation of Selenium,
which is run by a process called webdriver-manager. At the moment it expects
this to be available system wide. In order to ensure this, run these steps:

1. npm install -g protractor
2. webdriver-manager update
3. webdriver-manager start



