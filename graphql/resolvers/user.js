const bycrpt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = require('../../utils/prisma');
const { UserInputError } = require('apollo-server-express');
const { validateRegister, validateLogin } = require('../../utils/validators');

const { JWT_SECRET } = require('../../constants');

const loginUser = async (_, args) => {
  const { username, password } = args;
  const { errors, valid } = validateLogin(username, password);

  if (!valid) {
    throw new UserInputError(Object.values(errors)[0], { errors });
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new UserInputError(`User ${username} doesn't exist`);
  }

  const passwordMatch = await bycrpt.compare(password, user.password);

  if (!passwordMatch) {
    throw new UserInputError(`Email or password donot match`);
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET);

  return { id: user.id, username: user.username, token };
};

const registerUser = async (_, args) => {
  const { username, password, confirmPassword } = args;
  const { errors, valid } = validateRegister(
    username,
    password,
    confirmPassword,
  );

  if (!valid) {
    throw new UserInputError(Object.values(errors)[0], { errors });
  }

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw new UserInputError(`Username ${username} already taken`);
  }

  const saltRounds = 10;
  const passwordHash = await bycrpt.hash(password, saltRounds);
  const user = {
    username,
    password: passwordHash,
  };

  const savedUser = await prisma.user.create({ data: user });

  const token = jwt.sign({ id: savedUser.id }, JWT_SECRET);

  return { id: savedUser.id, username: savedUser.username, token };
};

module.exports = {
  Mutation: {
    registerUser,
    loginUser,
  },
};
