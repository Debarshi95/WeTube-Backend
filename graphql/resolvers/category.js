const { UserInputError } = require('apollo-server-express');
const prisma = require('../../utils/prisma');

const getAllCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        videos: {
          include: {
            video: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    const result = categories.map((category) => ({
      ...category,
      videos: category.videos.map((video) => video.video),
    }));

    return result;
  } catch (error) {
    throw new UserInputError(error);
  }
};

module.exports = {
  Query: {
    getAllCategories,
  },
};
