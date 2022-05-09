const bycrpt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = require('../../utils/prisma');
const { UserInputError } = require('apollo-server-express');
const { validateRegister, validateLogin } = require('../../utils/validators');

const { JWT_SECRET } = require('../../constants');

const loginUser = async (_, args) => {
  const { email, password } = args;
  const { errors, valid } = validateLogin(email, password);

  if (!valid) {
    throw new UserInputError(Object.values(errors)[0], { errors });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new UserInputError(`User doesn't exist`);
  }

  const passwordMatch = await bycrpt.compare(password, user.password);

  if (!passwordMatch) {
    throw new UserInputError(`Email or password donot match`);
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      token,
    },
  });

  return { id: user.id, username: user.username, email: user.email, token };
};

const registerUser = async (_, args) => {
  const { username, email, password, confirmPassword } = args;
  const { errors, valid } = validateRegister(
    username,
    email,
    password,
    confirmPassword,
  );

  if (!valid) {
    throw new UserInputError(Object.values(errors)[0], { errors });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new UserInputError(`Username or email already taken`);
  }

  const saltRounds = 10;
  const passwordHash = await bycrpt.hash(password, saltRounds);
  const user = {
    username,
    email,
    password: passwordHash,
  };

  const savedUser = await prisma.user.create({ data: user });

  const token = jwt.sign({ id: savedUser.id }, JWT_SECRET);

  await prisma.user.update({
    where: {
      id: savedUser.id,
    },
    data: {
      token,
    },
  });

  return {
    id: savedUser.id,
    username: savedUser.username,
    email: savedUser.email,
    token,
  };
};

const getUser = async (_, args) => {
  const { token } = args;

  if (!token) {
    throw new UserInputError('Token or Id not provided');
  }
  const user = await prisma.user.findFirst({
    where: { token },
  });
  if (!user) {
    throw new UserInputError(`User doesn't exist`);
  }

  const newToken = jwt.sign({ id: user.id }, JWT_SECRET);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      token: newToken,
    },
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    token: newToken,
  };
};

const logoutUser = async (_, __, ctx) => {
  const { headers } = ctx.req;
  const token = headers?.authorization || null;
  console.log({ token, headers });
  if (!token) {
    throw new UserInputError('Token or Id not provided');
  }
  const user = await prisma.user.findFirst({
    where: { token },
  });
  if (!user) {
    throw new UserInputError(`User doesn't exist`);
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      token: '',
    },
  });
};

module.exports = {
  Mutation: {
    registerUser,
    loginUser,
    logoutUser,
  },
  Query: {
    getUser,
  },
};
