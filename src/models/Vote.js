// src/models/Vote.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Vote = sequelize.define('Vote', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    optionId: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    timestamps: true,  // This is important
    tableName: 'votes',  // Explicitly set table name
    indexes: [
        {
            unique: true,
            fields: ['userId', 'optionId']  // Ensure a user can vote only once per option
        }
    ]
});

module.exports = Vote;
