const { UserInputError } = require('apollo-server-express');
const prisma = require('../../utils/prisma');

const getAllVideos = async () => {
  try {
    const videos = await prisma.video.findMany({
      include: {
        user: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    const result = videos.map((video) => ({
      ...video,
      categories: video.categories.map((category) => category.category),
    }));

    return result;
  } catch (err) {
    console.log({ err });
    throw new UserInputError(err);
  }
};
const getVideoById = async (_, args) => {
  try {
    const video = await prisma.video.findUnique({
      where: {
        id: args.videoId,
      },
      include: {
        user: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    const result = {
      ...video,
      categories: video.categories.map((category) => category.category),
    };

    return result;
  } catch (error) {
    throw new UserInputError(error);
  }
};

const getVideoByCategory = async (_, args) => {
  try {
    const video = await prisma.video.findMany({
      where: {
        categories: {
          some: {
            category: {
              name: args.categoryName,
            },
          },
        },
      },
      include: {
        user: true,
      },
    });

    return video;
  } catch (error) {
    throw new UserInputError(error);
  }
};
module.exports = {
  Query: {
    getAllVideos,
    getVideoById,
    getVideoByCategory,
  },
};
