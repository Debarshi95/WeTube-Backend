const { sequelize } = require('../models');

const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Connected to Database');
  } catch (error) {
    console.log(`Couldn't connect to database ${error}`);
  }
};

module.exports = connectToDB;
