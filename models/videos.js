'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Videos extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'uploadedBy',
      });

      this.belongsToMany(models.Category, {
        through: 'video_categories',
        as: 'categoryId',
      });
    }
  }
  Videos.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING(2048),
      likes: DataTypes.INTEGER,
      viewCount: DataTypes.INTEGER,
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Videos',
      tableName: 'videos',
    },
  );
  return Videos;
};
