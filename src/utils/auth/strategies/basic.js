const passport = require("passport");
const { BasicStrategy } = require("passport-http");
const boom = require("boom");
const bcrypt = require("bcrypt");
const MongoLib = require("../../../lib/mongo");

passport.use(
  new BasicStrategy(async function (email, password, cb) {
    const mongoDB = new MongoLib();
    console.log("entro a estrategia", email);
    try {
      const [user] = await mongoDB.getAll("users", { email });

      if (!user) {
        return cb(boom.unauthorized(), false);
      }

      const reponsebcrypt = await bcrypt.compare(password, user.password);

      if (!reponsebcrypt) {
        return cb(boom.unauthorized(), false);
      }

      return cb(null, user);
    } catch (error) {
      return cb(error);
    }
  })
);
