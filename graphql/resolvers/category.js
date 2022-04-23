const { UserInputError } = require('apollo-server-express');
const { Videos, Category } = require('../../models');

const getAllCategories = async () => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Videos,
          as: 'videoId',
        },
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
  },
};
