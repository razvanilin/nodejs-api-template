const base64 = require("base-64");
const utf8 = require("utf8");

const settings = process.env.NODE_ENV === "production" ? require("../settings") : require("../settings-dev");

module.exports.createRecipient = (user) => {
  const recipientMsg = [
    {
      "email": user.email,
      "first_name": user.name || "",
      "last_name": user.surname || ""
    }
  ];

  const recipientOptions = {
    method: "POST",
    url: `${settings.sendgridHost}/contactdb/recipients`,
    body: JSON.stringify(recipientMsg),
    headers: {
      authorization: `Bearer ${settings.sendgridKey}`,
      "content-type": "application/json"
    }
  };
  return recipientOptions;
};

module.exports.getRecipientId = (user) => {
  const bytes = utf8.encode(user.email);
  const encoded = base64.encode(bytes);
  return encoded;
};

module.exports.welcome = (data) => {
  const message = {
    "from": { "email": settings.adminEmail },
    "subject": "Welcome",
    "personalizations": [{
      "to": [{ email: data.email }],
      "dynamic_template_data": {
        "name": data.name,
      }
    }],
    "template_id": settings.sendgrid.welcomeId,
  };

  const options = {
    method: "POST",
    url: `${settings.sendgrid.host}/mail/send`,
    body: JSON.stringify(message),
    headers: {
      authorization: `Bearer ${settings.sendgrid.key}`,
      "content-type": "application/json"
    }
  };

  return options;
};

module.exports.passwordReset = (data) => {
  const message = {
    "from": { "email": settings.adminEmail },
    "subject": "Password Reset",
    "personalizations": [{
      "to": [{ email: data.email }],
      "dynamic_template_data": {
        "reset_url": data.resetUrl,
      }
    }],
    "template_id": settings.sendgrid.passwordResetId,
  };

  const options = {
    method: "POST",
    url: `${settings.sendgrid.host}/mail/send`,
    body: JSON.stringify(message),
    headers: {
      authorization: `Bearer ${settings.sendgrid.key}`,
      "content-type": "application/json"
    }
  };

  return options;
};

module.exports.deleteUser = (app, recipientId) => {
  const options = {
    method: "DELETE",
    url: `${settings.sendgrid.host}/contactdb/recipients/${recipientId}`,
    headers: {
      authorization: `Bearer ${settings.sendgrid.key}`,
      "content-type": "application/json"
    }
  };
  return options;
};
