'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class symptom extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.symptom.belongsToMany(models.period, { through: 'periodSymptoms' });
        }
    };
    symptom.init({
        type: DataTypes.STRING,
        severity: DataTypes.INTEGER,
        date: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'symptom',
    });
    return symptom;
};