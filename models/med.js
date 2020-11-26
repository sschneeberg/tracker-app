'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class med extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.med.belongsToMany(model.user, { through: 'usersMeds' });
        }
    };
    med.init({
        name: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'med',
    });
    return med;
};