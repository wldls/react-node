const passport = require("passport");
const local = require("./local");
const { User } = require("../models");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      // 세션에서 가지고 있는 user id에 대한 정보를 db에서 찾아서 불러옴
      const user = await User.findOne({ where: { id } });
      done(null, user); // req.user로 만든다.
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local();
};
