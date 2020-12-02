'use strict';
const bcrypt = require('bcrypt');

const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.user.hasMany(models.period);
            models.user.hasMany(models.activity);
            models.user.hasMany(models.note);
            models.user.belongsToMany(models.med, { through: 'usersMeds' });
        }
    };
    user.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: { args: [1, 99], msg: 'Username must be at least 4 characters' }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: { args: [8, 99], msg: 'Password must be at least 8 characters' },
            }
        },
        avgCycle: DataTypes.INTEGER,
        avgPeriod: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'user',
    });

    //password protection
    user.addHook('beforeCreate', (pendingUser) => {
        //Bcrypt make hash password
        let hashPassword = bcrypt.hashSync(pendingUser.password, 12);
        //replace password with hash
        pendingUser.password = hashPassword;
    })

    //validate user when logging in
    user.prototype.validPassword = function(passwordTyped) {
        let correctPassword = bcrypt.compareSync(passwordTyped, this.password);
        return correctPassword;
    }

    //remove password before it get serialized in req
    user.prototype.toJSON = function() {
        let userData = this.get();
        delete userData.password;
        return userData;
    }

    return user;
};