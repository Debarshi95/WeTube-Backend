'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      this.belongsTo(models.Videos, {
        foreignKey: 'videoId',
        as: 'video',
      });
    }
  }
  Comments.init(
    {
      content: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Comments',
      tableName: 'comments',
    },
  );
  return Comments;
};
