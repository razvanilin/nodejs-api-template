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

## API Specs

| Route          | Headers      | Body         |
| :------------- | :----------  | :----------- |
| **POST** <br> /user <br><br> Create a new user| None needed  | email: `<email>` <br> name: `<name>` <br> password: `<password>`    |
| **DELETE** <br> /user/:id <br><br> Remove a user based on `id`  | `Authorization`: `Bearer <token>` | None |
| **POST** <br> /user/login <br><br> Login for users | None needed | email: `<email>` <br> password: `<password>` |
| **POST** <br> /user/relog <br><br> Login a user using an authentication token | `Authorization`: `Bearer <token>` | None |
| **PUT** <br> /user/:id  <br></br> Update a user based on `id` | `Authorization`: `Bearer <token>` | Any fields that need to be updated |
| **POST** <br> /user/password/reset <br><br> Sends a password reset email containing a `token` and a `hash` used for authentication.  | None needed | email: `<email>` |
| **PUT** <br> /user/password/change <br><br> `token` and `hash` are generated during the reset call. Grab them from the URL.  | None needed | token: `<token>` <br> hash: `<hash>` <br> password: `<newPassword>` |
