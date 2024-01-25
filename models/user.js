'use strict';
const bcryptjs = require('bcryptjs');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Movie, { through: 'Wishlist', foreignKey:"UserId" });
      User.hasMany(models.Profile, {foreignKey: "id"})
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    hooks:{
      beforeCreate(instances, options){
        let salt = bcryptjs.genSaltSync(10)
          let encryptPassword = bcryptjs.hashSync(instances.password, salt)
          instances.password = encryptPassword
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};