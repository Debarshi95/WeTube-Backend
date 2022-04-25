const { UserInputError } = require('apollo-server-express');
const { Op } = require('sequelize');
const { Videos, Category, User } = require('../../models');

const getAllCategories = async () => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Videos,
          as: 'videoId',
          include: [{ model: User, as: 'uploadedBy' }],
        },
      ],
    });
    console.log({ categories: JSON.stringify(categories) });
    return categories;
  } catch (error) {
    throw new UserInputError(error);
  }
};

const getVideoByCategory = async (_, args) => {
  try {
    const categories = await Videos.findAll({
      include: [
        {
          model: Category,
          as: 'categoryId',
          where: {
            name: {
              [Op.iLike]: args.categoryName,
            },
          },
        },
        { model: User, as: 'uploadedBy' },
      ],
    });
    console.log({ categories: JSON.stringify(categories) });
    return categories;
  } catch (error) {
    throw new UserInputError(error);
  }
};

module.exports = {
  Query: {
    getAllCategories,
    getVideoByCategory,
  },
};
