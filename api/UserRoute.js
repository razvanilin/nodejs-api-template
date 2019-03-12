const jwt = require("jsonwebtoken");
const request = require("request");

const getMailSettings = require("../modules/getMailSettings");
const verifyToken = require("../modules/verifyToken");
const verifyOwner = require("../modules/verifyOwner");
const UserController = require("../controllers/UserController");

module.exports = (app) => {
  const userController = new UserController();

  /*
  ** Helper functions
  */
  const addUserToList = ((user) => {
    const recipientOptions = getMailSettings.createRecipient(app, user);
    return request(recipientOptions, (err, a, body) => {
      if (err) return new Promise(resolve => resolve({}));
      const jsonBody = JSON.parse(body);
      return jsonBody;
    });
  });

  const tokenizeUser = ((user) => {
    const userToken = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(userToken, app.settings.secret, {
      expiresIn: 2592000 // a month
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      icon: user.icon,
      token,
    };
  });
  // --------------------------------------

  /*
  ** Route for creating a new user
  */
  app.post("/user", (req, res) => {
    if (!req.body.email || !req.body.password) return res.status(400).send("no email or password");

    const userObj = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    return userController.create(userObj)
      .then((newUser) => {
        const user = newUser;

        // Add to Sengrid
        addUserToList(user);

        const tokenizedData = {
          id: user.id,
          email: user.email,
        };

        jwt.sign(tokenizedData, app.settings.secret, {
          expiresIn: 86400 // day
        }, (err) => {
          if (err) return res.status(400).send(err);

          // Send welcome email with Sendgrid
          const welcomeOpt = getMailSettings.welcome(user);
          return request(welcomeOpt, () => {
            return res.status(200).send(tokenizeUser(user));
          });
        });
      })
      .catch((error) => {
        if (error.message === "409") return res.status(409).send("The email is already used");
        return res.status(400).send(error);
      });
  });
  // --------------------------------------

  /*
  ** Route to remove a user
  */
  app.delete("/user/:id", verifyOwner, (req, res) => {
    if (req.user.id !== parseInt(req.params.id, 0)) return res.status(401).send("Unauthorised user");
    let user = {};
    return userController.findById(req.params.id)
      .then((foundUser) => {
        user = foundUser;
        return userController.delete(user.id);
      })
      // Remove the user's email from Sendgrid
      .then(() => {
        const recipientId = getMailSettings.getRecipientId(user);
        const options = getMailSettings.deleteUser(app, recipientId);
        return request(options);
      })
      .then(() => {
        return res.status(200).send({ removed: true });
      })
      .catch((error) => {
        return res.status(400).send(error);
      });
  });
  // --------------------------------------

  /*
  ** Route to login a user
  */
  app.post("/user/login", (req, res) => {
    if (!req.body.email || !req.body.password) return res.status(400).send("fields are missing");
    let user = {};
    return userController.login(req.body.email, req.body.password)
      .then((data) => {
        user = data;
        return userController.update(user.id, { lastLogin: new Date() });
      })
      .then(() => {
        return res.status(200).send(tokenizeUser(user));
      })
      .catch((error) => {
        if (error.message === "401") return res.status(401).send("The credentials are incorrect");
        if (error.message === "404") return res.status(404).send("The email is not registreded");
        return res.status(400).send(error);
      });
  });
  // --------------------------------------

  /*
  ** Route to relog a user
  */
  app.post("/user/relog", verifyToken, (req, res) => {
    return userController.update(req.user.id, { lastLogin: new Date() })
      .then(() => {
        return res.status(200).send(req.user);
      });
  });
  // --------------------------------------

  /*
  ** Route to update a user
  */
  app.put("/user/:id", verifyOwner, (req, res) => {
    if (!req.body || !req.params.id) return res.status(400).send("Missing fields");
    return userController.update(req.params.id, req.body)
      .then((user) => {
        return res.status(200).send(tokenizeUser(user));
      })
      .catch((error) => {
        return res.status(400).send(error);
      });
  });
  // --------------------------------------

  /*
  ** Route to request a password reset email
  */
  app.post("/user/password/reset", (req, res) => {
    return userController.requestPasswordReset(req.body.email)
      .then((result) => {
        return res.status(200).send(result);
      })
      .catch((error) => {
        if (error.message === "404") {
          return res.status(404).send(error);
        }

        return res.status(400).send(error);
      });
  });
  // --------------------------------------

  /*
  ** Route to change the password with a password reset link info
  */
  app.put("/user/password/change", (req, res) => {
    return userController.changePassword(req.body)
      .then((result) => {
        return res.status(200).send(result);
      })
      .catch((error) => {
        return res.status(400).send(error);
      });
  });
  // --------------------------------------

  return (req, res, next) => {
    next();
  };
};
