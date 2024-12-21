const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user');
const Option = require('./option');
const Poll = require('./Poll');

const Vote = sequelize.define(
  'Vote',
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      primaryKey: true,
    },
    optionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Option,
        key: 'id',
      },
      primaryKey: true,
    },
    pollId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Poll,
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
    tableName: 'votes',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'optionId'],
      },
    ],
  }
);

module.exports = Vote;
