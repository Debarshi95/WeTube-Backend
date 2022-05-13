const { UserInputError } = require('apollo-server-express')
const prisma = require('../../utils/prisma')

const getAllVideos = async () => {
  try {
    const videos = await prisma.video.findMany({
      include: {
        user: true,
        likes: {
          select: {
            id: true,
            user: true,
          },
        },
        _count: {
          select: {
            views: true,
          },
        },
      },
    })

    const result = videos.map((video) => {
      return {
        ...video,
        views: video._count.views,
        likes: video.likes.map((like) => ({ ...like })),
      }
    })

    return result
  } catch (err) {
    throw new UserInputError(err)
  }
}

const getVideoById = async (_, args) => {
  try {
    const video = await prisma.video.findUnique({
      where: {
        id: args.videoId,
      },
      include: {
        user: true,
        likes: {
          select: {
            id: true,
            user: true,
          },
        },
        _count: {
          select: {
            views: true,
          },
        },
      },
    })

    const result = {
      ...video,
      views: video._count.views,
      likes: video.likes.map((like) => ({ ...like })),
    }

    return result
  } catch (error) {
    throw new UserInputError(error)
  }
}

const getVideoByCategory = async (_, args) => {
  try {
    const videos = await prisma.video.findMany({
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
        likes: {
          select: {
            id: true,
            user: true,
          },
        },
        _count: {
          select: {
            views: true,
          },
        },
      },
    })

    const result = videos.map((video) => {
      return {
        ...video,
        views: video._count.views,
        likes: video.likes.map((like) => ({ ...like })),
      }
    })

    return result
  } catch (error) {
    throw new UserInputError(error)
  }
}

module.exports = {
  Query: {
    getAllVideos,
    getVideoById,
    getVideoByCategory,
  },
}
