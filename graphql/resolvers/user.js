const bycrpt = require('bcrypt')
const jwt = require('jsonwebtoken')

const prisma = require('../../utils/prisma')
const { UserInputError } = require('apollo-server-express')
const { validateRegister, validateLogin } = require('../../utils/validators')

const { JWT_SECRET } = require('../../constants')

const loginUser = async (_, args) => {
  const { email, password } = args
  const { errors, valid } = validateLogin(email, password)

  if (!valid) {
    throw new UserInputError(Object.values(errors)[0], { errors })
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      likes: {
        select: {
          id: true,
          user: true,
          video: true,
        },
      },
      views: {
        select: {
          id: true,
          user: true,
          video: true,
        },
      },
    },
  })

  if (!user) {
    throw new UserInputError(`User doesn't exist`)
  }

  const passwordMatch = await bycrpt.compare(password, user.password)

  if (!passwordMatch) {
    throw new UserInputError(`Email or password donot match`)
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET)

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      token,
    },
  })

  return {
    id: user.id,
    pic: user.pic,
    username: user.username,
    email: user.email,
    token,
    playlist: user.playlist,
    views: user.views,
    likes: user.likes,
  }
}

const registerUser = async (_, args) => {
  const { username, email, password, confirmPassword } = args
  const { errors, valid } = validateRegister(
    username,
    email,
    password,
    confirmPassword,
  )

  if (!valid) {
    throw new UserInputError(Object.values(errors)[0], { errors })
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  })

  if (existingUser) {
    throw new UserInputError(`Username or email already taken`)
  }

  const saltRounds = 10
  const passwordHash = await bycrpt.hash(password, saltRounds)
  const user = {
    username,
    email,
    password: passwordHash,
  }

  const savedUser = await prisma.user.create({ data: user })

  const token = jwt.sign({ id: savedUser.id }, JWT_SECRET)

  await prisma.user.update({
    where: {
      id: savedUser.id,
    },
    data: {
      token,
    },
  })

  return {
    id: savedUser.id,
    username: savedUser.username,
    pic: savedUser.pic,
    email: savedUser.email,
    token,
  }
}

const getUser = async (_, args) => {
  const { token } = args

  if (!token) {
    throw new UserInputError('Token or Id not provided')
  }
  const user = await prisma.user.findFirst({
    where: { token },
    include: {
      likes: {
        select: {
          id: true,
          user: true,
          video: true,
        },
      },
      views: {
        select: {
          id: true,
          user: true,
          video: true,
        },
      },
    },
  })

  if (!user) {
    throw new UserInputError(`User doesn't exist`)
  }

  const newToken = jwt.sign({ id: user.id }, JWT_SECRET)

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      token: newToken,
    },
  })

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    pic: user.pic,
    token: newToken,
    playlist: user.playlist,
    views: user.views,
    likes: user.likes,
  }
}

const logoutUser = async (_, __, ctx) => {
  const { headers } = ctx.req
  const token = headers?.authorization || null

  if (!token) {
    throw new UserInputError('Token or Id not provided')
  }

  const user = await prisma.user.findFirst({
    where: { token },
  })

  if (!user) {
    throw new UserInputError(`User doesn't exist`)
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      token: '',
    },
  })

  return {
    success: true,
    messages: 'Logged out successfully!',
  }
}

const getAllViews = async (_, args, ctx) => {
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

  const views = await prisma.view.findMany({
    where: {
      userId: user.id,
    },
    take: 8,
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
    orderBy: {
      createdAt: 'desc',
    },
  })

  const result = views.map((view) => ({
    ...view,
    video: { ...view.video, views: view.video._count.views },
  }))

  return result
}
const deleteView = async (_, args, ctx) => {
  const { headers } = ctx.req
  const token = headers?.authorization || null

  const { viewId, type = '' } = args

  if (!token) {
    throw new UserInputError('Token or Id not provided')
  }
  const user = await prisma.user.findFirst({
    where: { token },
  })

  if (!user) {
    throw new UserInputError(`User not found`)
  }

  if (type === 'ALL') {
    await prisma.view.deleteMany({
      where: {
        userId: user.id,
      },
    })
  } else {
    await prisma.view.delete({
      where: {
        id: viewId,
      },
    })
  }

  return {
    success: true,
    message: 'View updated successfully',
  }
}
const updateView = async (_, args, ctx) => {
  const { headers } = ctx.req
  const token = headers?.authorization || null

  const { videoId } = args

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
    throw new UserInputError(`Couldn't update view`)
  }

  const view = {
    userId: user.id,
    videoId: video.id,
  }

  await prisma.view.create({
    data: view,
  })

  return {
    success: true,
    message: 'View updated successfully',
  }
}

const updateLike = async (_, args, ctx) => {
  const { headers } = ctx.req
  const token = headers?.authorization || null

  const { videoId } = args

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
    throw new UserInputError(`Couldn't update like`)
  }

  const isLiked = await prisma.videoLike.findFirst({
    where: {
      AND: [{ userId: user.id }, { videoId: video.id }],
    },
  })

  if (isLiked) {
    await prisma.videoLike.delete({
      where: {
        id: isLiked.id,
      },
    })

    return {
      success: true,
      message: 'Unliked video successfully',
    }
  }

  const likeData = {
    userId: user.id,
    videoId: video.id,
  }

  await prisma.videoLike.create({
    data: likeData,
  })

  return {
    success: true,
    message: 'Liked video successfully',
  }
}

const updateWatchLater = async (_, args, ctx) => {
  const { headers } = ctx.req
  const token = headers?.authorization || null

  const { videoId } = args

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
    throw new UserInputError(`Couldn't update like`)
  }

  const watchLaterData = await prisma.watchLater.findFirst({
    where: {
      AND: [{ userId: user.id }, { videoId: video.id }],
    },
  })

  if (watchLaterData) {
    await prisma.watchLater.delete({
      where: {
        id: watchLaterData.id,
      },
    })

    return {
      success: true,
      message: 'Removed from watch later',
    }
  }

  const data = {
    userId: user.id,
    videoId: video.id,
  }

  await prisma.watchLater.create({
    data,
  })

  return {
    success: true,
    message: 'Added to watcher later',
  }
}

const getAllWatch = async (_, __, ctx) => {
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

  const watches = await prisma.watchLater.findMany({
    where: {
      userId: user.id,
    },
    take: 8,
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
    orderBy: {
      createdAt: 'desc',
    },
  })

  const result = watches.map((watch) => ({
    ...watch,
    video: { ...watch.video, views: watch.video._count.views },
  }))

  return result
}

module.exports = {
  Mutation: {
    registerUser,
    loginUser,
    logoutUser,
    updateView,
    updateLike,
    deleteView,
    updateWatchLater,
  },
  Query: {
    getUser,
    getAllViews,
    getAllWatch,
  },
}
