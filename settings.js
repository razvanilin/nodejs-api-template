module.exports = {
  port: 3210,
  adminEmail: process.env.APP_ADMIN_EMAIL,
  secret: process.env.APP_SECRET,
  db: {
    dbName: process.env.APP_DB_NAME,
    dbUsername: process.env.APP_DB_USERNAME,
    dbPassword: process.env.APP_DB_PASSWORD,
    dbHost: process.env.APP_DB_HOST,
  },
  sendgrid: {
    key: process.env.APP_SENDGRID_ID,
    host: "https://api.sendgrid.com/v3",
    passwordResetId: process.env.APP_SENDGRID_PASSWORD,
    welcomeId: process.env.APP_SENDGRID_WELCOME,
  },
};
