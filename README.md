# NodeJS API Template

Comes with:
* NodeJS & ExpressJS
* Sequelize (supports MySql, PostgreSQL, sqlite3, MsSQL)
* Token-based user authentication
* Sengrid starter code
* ESLint
* TODO: tests

## Get Started

```
git clone https://github.com/razvanilin/nodejs-api-template.git
cd nodejs-api-template
npm install && npm install -g nodemon
```

### Setup your database

MySql is installed automatically. Refer to the [Sequelize documentation](http://docs.sequelizejs.com/manual/installation/getting-started) to learn how to install and use the other databases. The database setup is done in:

`nodejs-api-template/modules/dbConnection.js`

Make sure you create a database with the name you have in `settings{-dev}.js` before running the project.

### Settings & Environmental variables

The project can be run in `development` and `production` out of the box. Check `settings-dev.js` and `settings.js` to set up your environmental variables. Make sure you don't expose your production `SECRET` and APi Keys to Git!

### Setup Sendgrid

Create a new account here: https://signup.sendgrid.com/

Create a new API KEY and add it as an environmental variable on your machine: https://app.sendgrid.com/settings/api_keys

* Make sure the variable name matches the one in `settings{-dev}.js`

Create your templates for the Welcome and Forgot Password for the transactional emails https://sendgrid.com/dynamic_templates

Copy the template IDs into `settings{-dev}.js` files or place them in environmental variables

## Starting

```
# development
npm run start-dev

# production
npm run start
```
