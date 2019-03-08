module.exports = {
  port: 3210,
  adminEmail: "info@email.com",
  secret: "secret_stuff",
  db: {
    dbName: "coolApp",
    dbUsername: "root",
    dbPassword: "",
    dbHost: "",
  },
  sendgrid: {
    key: process.env.APP_SENDGRID_ID,
    host: "https://api.sendgrid.com/v3",
    passwordResetId: "<id>",
    welcomeId: "<id>",
  },
};
