'use strict';
const {
    Model
} = require('sequelize');
const db = require('.');
module.exports = (sequelize, DataTypes) => {
    class period extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.period.belongsToMany(models.symptom, { through: 'periodSymptoms' });
            models.period.hasMany(models.note);
            models.period.belongsTo(models.user);

        }
    };
    period.init({
        userId: DataTypes.INTEGER,
        startDate: DataTypes.STRING,
        endDate: DataTypes.STRING,
        cycleLength: DataTypes.INTEGER,
        periodLength: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'period',
    });

    return period;
};