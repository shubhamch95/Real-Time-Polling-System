const Poll = require('./Poll');
const Option = require('./Option');
const Vote = require('./Vote');
const { Sequelize } = require('sequelize');

// Set up associations
Poll.hasMany(Option, {
    foreignKey: 'pollId',
    onDelete: 'CASCADE'
});
Option.belongsTo(Poll);

Option.hasMany(Vote, {
    foreignKey: 'optionId',
    onDelete: 'CASCADE'
});
// Vote.belongsTo(Option);
Vote.belongsTo(Option, { foreignKey: 'optionId' });


// Sync all models with force option to recreate tables
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
    Sequelize,
    syncModels
};