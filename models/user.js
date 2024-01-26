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
      User.hasOne(models.Profile, {foreignKey: "id"})
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: "Username Cannot be Empty"
        },
        notNull:{
          msg: "Username Cannot be Empty"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: "Password Cannot be Empty"
        },
        notNull:{
          msg: "Password Cannot be Empty"
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: "Role Must Be Selected"
        },
        notNull:{
          msg: "Role Must Be Selected"
        }
      }
    }
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