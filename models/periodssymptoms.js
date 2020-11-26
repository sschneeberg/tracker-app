'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class periodsSymptoms extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    periodsSymptoms.init({
        periodId: DataTypes.INTEGER,
        symptomId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'periodsSymptoms',
    });
    return periodsSymptoms;
};