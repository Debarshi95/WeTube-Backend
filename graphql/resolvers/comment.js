const { UserInputError } = require('apollo-server-express')
const prisma = require('../../utils/prisma')

const getAllComments = async () => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: true,
        category: true,
      },
    })

    return comments
  } catch (error) {
    throw new UserInputError(error)
  }
}

module.exports = {
  Query: {
    getAllComments,
  },
}
