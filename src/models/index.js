const Poll = require('./Poll');
const Option = require('./option');
const Vote = require('./vote');
const User = require('./user');

// Associations
Poll.hasMany(Option, { foreignKey: 'pollId', onDelete: 'CASCADE', as: 'options' });
Option.belongsTo(Poll, { foreignKey: 'pollId', as: 'poll' });

Poll.hasMany(Vote, { foreignKey: 'pollId', onDelete: 'CASCADE', as: 'votes' });
Vote.belongsTo(Poll, { foreignKey: 'pollId', as: 'poll' });

Option.hasMany(Vote, { foreignKey: 'optionId', onDelete: 'CASCADE', as: 'votes' });
Vote.belongsTo(Option, { foreignKey: 'optionId', as: 'option' });

User.hasMany(Vote, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'votes' });
Vote.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Poll, { foreignKey: 'userId', onDelete: 'CASCADE', as: 'polls' });
Poll.belongsTo(User, { foreignKey: 'userId', as: 'creator' });

// Sync all models
const syncModels = async () => {
  try {
    console.log('Starting database synchronization...');
    await Poll.sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
    throw error;
  }
};

module.exports = {
  Poll,
  Option,
  Vote,
  User,
  syncModels,
};
