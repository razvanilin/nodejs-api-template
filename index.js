require("dotenv").config();

const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const _ = require("lodash");

const settings = process.env.NODE_ENV === "production" ? require("./settings") : require("./settings-dev");
const models = require("./models/index");
const routes = require("./api");

const app = express();
app.settings = settings;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("X-HTTP-Method-Override"));

app.use(cors());
//---------------------------------------


app.get("/", (req, res) => {
  return res.send("Welcome to the API");
});

// Load the models
app.models = models;

// Load the routes
_.each(routes, (controller, route) => {
  app.use(route, controller(app));
});

app.listen(app.settings.port, () => {
  console.log(`Running server on port ${app.settings.port}`); // eslint-disable-line
});
