const Sequelize = require("sequelize");
const simplecrypt = require("simplecrypt");
const db = require("../modules/dbConnection");
const settings = process.env.NODE_ENV === "production" ? require("../settings") : require("../settings-dev");

const sc = simplecrypt({
  password: settings.secret,
  salt: "10",
});

const User = db.define("User", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    get() {
      try {
        return sc.decrypt(this.getDataValue("name"));
      } catch (e) {
        return this.getDataValue("name");
      }
    },
    set(val) {
      return this.setDataValue("name", sc.encrypt(val));
    },
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    get() {
      try {
        return sc.decrypt(this.getDataValue("email"));
      } catch (e) {
        return this.getDataValue("email");
      }
    },
    set(val) {
      return this.setDataValue("email", sc.encrypt(val));
    },
  },
  admin: {
    type: Sequelize.BOOLEAN,
    set() {
      // make sure this can't be set through the API (at least for now)
      return null;
    }
  },
  lastLogin: {
    type: Sequelize.DATE,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    set(val) {
      return this.setDataValue("password", sc.encrypt(val));
    },
  },
  icon: {
    type: Sequelize.STRING,
  },
  passwordResetToken: {
    type: Sequelize.STRING,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
  }
}, {
  freezeTableName: true
});

User.prototype.decryptValue = (val) => {
  return sc.decrypt(val);
};

module.exports = User;
