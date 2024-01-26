'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {foreignKey: "id"})
    }

    get age(){
      let date = new Date()
      let currentYear = date.getFullYear()
      let birthYear = this.dateOfBirth.getFullYear()
      return currentYear - birthYear
    }
  }
  Profile.init({
    firstName:{
      type:  DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty:{
          msg: "First Name Cannot be Empty"
        },
        notNull:{
          msg: "First Name Cannot be Empty"
        }
      }
    },
    lastName: {
      type:  DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty:{
          msg: "Last Name Cannot be Empty"
        },
        notNull:{
          msg: "Last Name Cannot be Empty"
        }
      }
    },
    email: {
      type:  DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty:{
          msg: "Email Cannot be Empty"
        },
        notNull:{
          msg: "Email Cannot be Empty"
        },
        isEmail: {
          msg: "Email Invalid"
        }
      }
    },
    dateOfBirth: {
      type:  DataTypes.DATE,
      allowNull: false,
      notEmpty:{
        msg: "Date Cannot be Empty"
      },
      notNull:{
        msg: "Date Cannot be Empty"
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};