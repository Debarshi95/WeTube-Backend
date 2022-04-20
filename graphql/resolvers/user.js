const bycrpt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const { User } = require('../../models');
const { UserInputError } = require('apollo-server-express');
const { validateRegister, validateLogin } = require('../../utils/validators');

const { JWT_SECRET } = require('../../constants');

const loginUser = async (_, args) => {
  const { username, password } = args;
  const { errors, valid } = validateLogin(username, password);

  if (!valid) {
    throw new UserInputError(Object.values(errors)[0], { errors });
  }

  console.log({ User });
  const user = await User.findOne({
    where: { username: { [Op.iLike]: username } },
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

  console.log({ User });
  const existingUser = await User.findOne({
    where: { username: { [Op.iLike]: username } },
  });
  console.log({ existingUser });
  if (existingUser) {
    throw new UserInputError(`Username ${username} already taken`);
  }

  const saltRounds = 10;
  const passwordHash = await bycrpt.hash(password, saltRounds);
  const user = new User({
    username,
    password: passwordHash,
  });

  const savedUser = await user.save();

  const token = jwt.sign({ id: savedUser.id }, JWT_SECRET);

  return { id: savedUser.id, username: savedUser.username, token };
};

module.exports = {
  Mutation: {
    registerUser,
    loginUser,
  },
};
