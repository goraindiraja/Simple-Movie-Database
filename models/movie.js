'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movie.belongsToMany(models.User, { through: 'Wishlist', foreignKey: "MovieId" });
      Movie.belongsTo(models.Rating,{foreignKey:"RatingId"} )
    }

    get videoLink(){
      let link = this.trailerURL.slice(-11)
      return `https://www.youtube.com/embed/${link}`
    }
  }
  Movie.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: "Title cannot be empty !"
        },
        notNull:{
          msg: "Title cannot be empty !"
        }
      }
    },
    director: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: "Director's Name cannot be empty !"
        },
        notNull:{
          msg: "Director's Name cannot be empty !"
        }
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: "Duration cannot be empty !"
        },
        notNull:{
          msg: "Duration cannot be empty !"
        },
        min: {
          args: [30],
          msg: "Minimum Movie Duration is 30 Minutes"
        }
      }
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: "Genre cannot be empty !"
        },
        notNull:{
          msg: "Genre cannot be empty !"
        }
      }
    },
    votes: DataTypes.INTEGER,
    trailerURL: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: "Trailer URL cannot be empty !"
        },
        notNull:{
          msg: "Trailer URL cannot be empty !"
        }
      }
    },
    imageURL: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: "Image File cannot be empty !"
        },
        notNull:{
          msg: "Image File cannot be empty !"
        },
      }
    },
    synopsis: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: "Synopsis cannot be empty !"
        },
        notNull:{
          msg: "Synopsis cannot be empty !"
        },

        isMinWord(value){
          if(this.synopsis.split(" ").length < 10){
            throw new Error("Synopsis is less than 10 Words")
          }
        }
      }
    },
    RatingId: DataTypes.INTEGER,
    releasedYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: "Released Year cannot be empty !"
        },
        notNull:{
          msg: "Released Year cannot be empty !"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};