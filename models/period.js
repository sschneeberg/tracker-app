'use strict';
const {
    Model
} = require('sequelize');
const moment = require('moment');

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
            models.period.belongsTo(models.user);

        }

        //get all days of period if started
        getDays() {
            if (this.startDate) {
                const days = [];
                //if period has started and ended
                if (this.endDate) {
                    let day = this.startDate;
                    while (moment(day).format('M D YYYY') <= moment(this.endDate).format('M D YYYY')) {
                        days.push(day);
                        day = moment(day).add(1, 'd').toDate();
                    }
                } else {
                    //if period has started but not ended count up to today
                    let day = this.startDate;
                    while (moment(day).format('M D YYYY') <= moment().format('M D YYYY')) {
                        days.push(day);
                        day = moment(day).add(1, 'd').toDate();
                    }
                }
                return days;
            } else {
                return;
            }
        }

        getLength() {
            return (Math.floor((Date.parse(this.endDate) - Date.parse(this.startDate)) / 86400000) + 1);
        }

    };
    period.init({
        userId: DataTypes.INTEGER,
        startDate: DataTypes.DATE,
        endDate: DataTypes.DATE,
        cycleLength: DataTypes.INTEGER,
        periodLength: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'period',
    });

    return period;
};