module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      // id가 기본적으로 들어있다.
      email: {
        type: DataTypes.STRING(20), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
        allowNull: false, // 필수
        unique: true, // 고유한 값
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
      },
      password: {
        type: DataTypes.STRING(100), // 비멀번호 암호화시 길이가 늘어날 수 있으므로
        allowNull: false, // 필수
      },
      // MySQL에는 users 테이블 생성
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci", // 한글 저장
    }
  );
  User.associate = (db) => {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreignkey: "FolloweingId",
    });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignkey: "FollowerId",
    });
  };
  return User;
};
