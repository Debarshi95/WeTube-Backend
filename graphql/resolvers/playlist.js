const { UserInputError } = require('apollo-server-express')
const prisma = require('../../utils/prisma')

const createPlaylist = async (_, args, ctx) => {
  const { headers } = ctx.req
  const token = headers?.authorization || null

  const { videoId, name = 'Playlist 1' } = args

  if (!token) {
    throw new UserInputError('Token or Id not provided')
  }
  const user = await prisma.user.findFirst({
    where: { token },
  })

  const video = await prisma.video.findUnique({
    where: {
      id: videoId,
    },
  })

  if (!user || !video) {
    throw new UserInputError(`Couldn't create playlist`)
  }

  const playlistExists = await prisma.playlist.findFirst({
    where: {
      userId: user.id,
      name,
    },
  })

  if (playlistExists) {
    return {
      success: false,
      message: `Playlist with name ${name} exists`,
    }
  }

  await prisma.playlist.create({
    data: {
      name,
      userId: user.id,
      videos: {
        connectOrCreate: {
          create: {
            videoId: video.id,
          },
          where: {
            id: video.id,
          },
        },
      },
    },
  })

  return {
    success: true,
    message: 'Added to Playlist',
  }
}

const getAllPlaylists = async (_, __, ctx) => {
  const { headers } = ctx.req
  const token = headers?.authorization || null

  if (!token) {
    throw new UserInputError('Token or Id not provided')
  }
  const user = await prisma.user.findFirst({
    where: { token },
  })

  if (!user) {
    throw new UserInputError(`User not found`)
  }

  const playlist = await prisma.playlist.findMany({
    where: {
      userId: user.id,
    },
    include: {
      user: true,
      videos: {
        include: {
          video: {
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
          },
        },
      },
    },
    take: 6,
    orderBy: {
      createdAt: 'desc',
    },
  })

  const result = playlist.map((playlist) => ({
    ...playlist,
    videos: playlist.videos.map((video) => ({
      ...video.video,
      views: video.video._count.views,
    })),
  }))
  return result
}

const updatePlaylist = async (_, args, ctx) => {
  const { headers } = ctx.req
  const token = headers?.authorization || null
  const { playlistId = '', videoId = '' } = args

  if (!token) {
    throw new UserInputError('Token or Id not provided')
  }
  const user = await prisma.user.findFirst({
    where: { token },
  })

  const video = await prisma.video.findUnique({
    where: {
      id: videoId,
    },
  })

  if (!user || !video) {
    throw new UserInputError(`Couldn't create playlist`)
  }

  const videoExists = await prisma.playlist.findFirst({
    where: {
      AND: {
        id: playlistId,
        videos: {
          some: {
            video: {
              id: video.id,
            },
          },
        },
      },
    },
  })

  if (videoExists) {
    return {
      success: false,
      message: 'Video exists in Playlist',
    }
  }

  await prisma.playlist.update({
    where: {
      id: playlistId,
    },
    data: {
      videos: {
        connectOrCreate: {
          create: {
            videoId: video.id,
          },
          where: {
            id: video.id,
          },
        },
      },
    },
  })

  return {
    success: true,
    message: 'Video added to Playlist',
  }
}

const deletePlaylist = async (_, args, ctx) => {
  const { headers } = ctx.req
  const token = headers?.authorization || null

  const { playlistId, videoId = '', type = '' } = args

  if (!token) {
    throw new UserInputError('Token or Id not provided')
  }

  const user = await prisma.user.findFirst({
    where: { token },
  })

  if (!user || !playlistId) {
    throw new UserInputError(`User or Playlist not found`)
  }

  if (type === 'ALL') {
    await prisma.playlist.delete({
      where: {
        id: playlistId,
      },
    })
    return {
      success: true,
      message: 'Playlist deleted succesfully!',
    }
  }

  const videoExists = await prisma.playlist.findFirst({
    where: {
      AND: {
        id: playlistId,
        videos: {
          some: {
            video: {
              id: videoId,
            },
          },
        },
      },
    },
  })

  if (!videoExists) {
    return {
      success: false,
      message: 'Video not added to Playlist',
    }
  }

  await prisma.playlistOnVideo.deleteMany({
    where: {
      AND: {
        playlistId,
        videoId,
      },
    },
  })

  return {
    success: true,
    message: 'Video deleted from Playlist',
  }
}
module.exports = {
  Query: {
    getAllPlaylists,
  },
  Mutation: {
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
  },
}
