'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Recipes.init({
    title: DataTypes.STRING,
    cook_time: DataTypes.STRING,
    url: DataTypes.STRING,
    picture: DataTypes.STRING,
    ingredients: DataTypes.TEXT,
    directions: DataTypes.TEXT,
    notes: DataTypes.TEXT,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Recipes',
  });
  return Recipes;
};