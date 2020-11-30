'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class periodSymptoms extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    periodSymptoms.init({
        periodId: DataTypes.INTEGER,
        symptomId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'periodSymptoms',
    });
    return periodSymptoms;
};