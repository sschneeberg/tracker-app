const moment = require('moment');
const bcrypt = require('bcrypt');


module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('users', [{
            name: 'Simone Schneeberg',
            username: 'sschneeberg',
            password: bcrypt.hashSync('pass4word', 12),
            avgCycle: 30,
            avgPeriod: 7,
            createdAt: new Date(),
            updatedAt: new Date()
        }], { returning: true }).then(function(user) {
            return queryInterface.bulkInsert('periods', [{
                userId: user[0].id,
                startDate: moment().subtract(7, 'd').format('M D YYYY'),
                endDate: moment().format('M D YYYY'),
                cycleLength: 28,
                periodLength: 7,
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                userId: user[0].id,
                startDate: moment().subtract(1, 'month').subtract(7, 'd').format('M D YYYY'),
                endDate: moment().subtract(1, 'month').format('M D YYYY'),
                cycleLength: 28,
                periodLength: 7,
                createdAt: new Date(),
                updatedAt: new Date()
            }], { returning: true }).then(function(periods) {
                return queryInterface.bulkInsert('symptoms', [{
                        type: 'cramps',
                        severity: 5,
                        date: moment().subtract(7, 'd').format('M D YYYY'),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }, {
                        type: 'cramps',
                        severity: 3,
                        date: moment().subtract(1, 'month').subtract(5, 'd').format('M D YYYY'),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        type: 'level',
                        severity: 4,
                        date: moment().subtract(4, 'd').format('M D YYYY'),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ], { returning: true }).then(function(symptoms) {
                    return queryInterface.bulkInsert('periodSymptoms', [{
                        periodId: periods[0].id,
                        symptomId: symptoms[0].id,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }, {
                        periodId: periods[0].id,
                        symptomId: symptoms[2].id,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }, {
                        periodId: periods[1].id,
                        symptomId: symptoms[1].id,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }], { returning: true }).then(function() {
                        return queryInterface.bulkInsert('notes', [{
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            periodId: periods[0].id,
                            content: 'First note, test note',
                            title: 'Test Note',
                            date: moment().format('M D YYYY')
                        }], { returning: true }).then(function() {
                            return queryInterface.bulkInsert('meds', [{
                                name: 'acetaminophen',
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            }], { returning: true }).then(function(med) {
                                return queryInterface.bulkInsert('usersMeds', [{
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                    medId: med[0].id,
                                    userId: user[0].id
                                }], { returning: true }).then(function() {
                                    return queryInterface.bulkInsert('activities', [{
                                        userId: user[0].id,
                                        date: moment().format('M D YYYY'),
                                        protection: 'condoms',
                                        createdAt: new Date(),
                                        updatedAt: new Date(),
                                    }], { returning: true })
                                })
                            })
                        })
                    })
                })
            })
        })
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('users', null, {})
    }
}