const simplecrypt = require("simplecrypt");
const uuid = require("uuid/v4");
const requestP = require("request-promise");

const User = require("../models/User");
const getMailSettings = require("../modules/getMailSettings");

const settings = process.env.NODE_ENV === "production" ? require("../settings") : require("../settings-dev");

const sc = simplecrypt({
  password: settings.secret,
  salt: "10",
});

class UserController {
  constructor() {
    this.user = User;
  }


  create(user) {
    return this.user.findOne({ where: { email: user.email } })
      .then((foundUser) => {
        if (foundUser) return new Promise((resolve, reject) => reject(new Error(409)));
        return this.user.create({
          "name": user.name,
          "email": user.email,
          "password": user.password,
          "icon": user.icon,
        });
      })
      .then((newUser) => { return newUser; })
      .catch((error) => {
        return new Promise((resolve, reject) => reject(new Error(error.message)));
      });
  }

  findById(id) {
    return this.user.findOne({
      where: { "id": id },
    }).then((user) => {
      if (!user) return new Promise((resolve, reject) => reject(new Error(404)));
      return user;
    }).catch((error) => {
      return new Promise((resolve, reject) => reject(error.message));
    });
  }

  update(id, data) {
    return this.user.update(data, { where: { "id": id } })
      .then(() => {
        return this.findById(id);
      })
      .catch((error) => {
        return new Promise((resolve, reject) => reject(new Error(error)));
      });
  }

  delete(id) {
    return this.user.destroy({ where: { id } })
      .then(() => {
        return true;
      })
      .catch((error) => {
        return new Promise((resolve, reject) => reject(error));
      });
  }


  login(email, password) {
    return this.user.findOne({ where: { "email": sc.encrypt(email) } })
      .then((foundUser) => {
        if (!foundUser) return new Promise((resolve, reject) => reject(new Error(404)));
        if (!(foundUser.password === sc.encrypt(password))) {
          return new Promise((resolve, reject) => reject(new Error(401)));
        }
        return foundUser;
      })
      .catch((error) => {
        return new Promise((resolve, reject) => reject(new Error(error.message)));
      });
  }

  requestPasswordReset(email) {
    const newToken = uuid();
    return this.user.findOne({ where: { email: sc.encrypt(email) } })
      .then((user) => {
        if (!user) {
          throw new Error(404);
        }

        return this.update(user.id, { passwordResetToken: newToken });
      })
      .then((user) => {
        const hash = sc.encrypt(JSON.stringify({
          id: user.id,
          email: user.email,
        }));

        const mailOpt = getMailSettings.passwordReset({
          email: user.email,
          resetUrl: `${settings.client}/passwordReset?token=${newToken}&hash=${hash}`,
        });

        return requestP(mailOpt);
      })
      .then((body) => {
        return new Promise(resolve => resolve(body));
      })
      .catch((error) => {
        return new Promise((resolve, reject) => reject(error));
      });
  }

  changePassword({ token, hash, password }) {
    // decrypt the hash to get the user information
    let user;
    try {
      user = JSON.parse(sc.decrypt(hash));
    } catch (e) {
      return new Promise((resolve, reject) => reject(e));
    }

    const userUpdate = {
      passwordResetToken: uuid(),
      password,
    };

    // check if the existing token is valid first
    return this.findById(user.id)
      .then((existingUser) => {
        if (existingUser.passwordResetToken !== token) {
          throw new Error(401);
        }

        return this.update(user.id, userUpdate);
      })
      .then(() => {
        return new Promise(resolve => resolve({ completed: true }));
      })
      .catch((error) => {
        return new Promise((resolve, reject) => reject(error));
      });
  }
}

module.exports = UserController;
