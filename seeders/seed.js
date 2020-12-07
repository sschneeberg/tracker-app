const moment = require('moment');
const bcrypt = require('bcrypt');


module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('users', [{
            name: 'Example User',
            username: 'euser',
            password: bcrypt.hashSync('pass4word', 12),
            avgCycle: 30,
            avgPeriod: 7,
            createdAt: new Date(),
            updatedAt: new Date()
        }], { returning: true }).then(function(user) {
            return queryInterface.bulkInsert('periods', [{
                userId: user[0].id,
                startDate: moment().subtract(1, 'month').subtract(7, 'd').toDate(),
                endDate: moment().subtract(1, 'month').toDate(),
                cycleLength: 28,
                periodLength: 7,
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                userId: user[0].id,
                startDate: moment().subtract(7, 'd').toDate(),
                endDate: moment().toDate(),
                cycleLength: 28,
                periodLength: 7,
                createdAt: new Date(),
                updatedAt: new Date()
            }], { returning: true }).then(function(periods) {
                return queryInterface.bulkInsert('symptoms', [{
                        type: 'cramps',
                        severity: 5,
                        date: moment().subtract(7, 'd').toDate(),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }, {
                        type: 'cramps',
                        severity: 3,
                        date: moment().subtract(1, 'month').subtract(5, 'd').toDate(),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        type: 'level',
                        severity: 4,
                        date: moment().subtract(4, 'd').toDate(),
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
                            userId: user[0].id,
                            content: 'First note, test note',
                            title: 'Test Note',
                            date: moment().toDate()
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
                                        date: moment().toDate(),
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