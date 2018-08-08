const request = require('supertest');
const { ObjectID } = require('mongodb');
const merge = require('lodash/merge');

const mongoose = require('../../../../src/server/db/mongoose');
const app = require('../../../../src/server/app');
const User = require('../../../../src/server/models/user');
const { users, populateUsers } = require('../../seed');
const createError = require('../../../../src/server/handlers/api-error');

beforeEach(populateUsers);

afterAll(done => {
    mongoose.close(done);
});

describe('src/server/routes/api/users.js', () => {
    describe('POST /api/v1/users', () => {
        test('should create a new user', done => {
            const user = {
                email: 'edwin3@mailinator.com',
                password: 'password3'
            };

            request(app)
                .post('/api/v1/users')
                .send(user)
                .expect(200)
                .expect(res => {
                    expect(res.body).toMatchObject({ email: user.email });
                })
                .end((err) => {
                    if (err) {
                        done(err);
                    }
                    User.find({ email: user.email })
                        .then(users => {
                            expect(users).toHaveLength(1);
                            expect(users[0]).toMatchObject({ email: user.email });
                            done();
                        }).catch(e => done(e));
                })
        });
        test('should not create a new user with invalid data', done => {
            request(app)
                .post('/api/v1/users')
                .send({})
                .expect(400)
                .expect(res => {
                    expect(res.body).toMatchObject(merge(
                        createError('email', 'ERREMAILREQUIRED'),
                        createError('password', 'ERRPASSREQUIRED')
                    ));
                })
                .end((err) => {
                    if (err) {
                        done(err);
                    }
                    User.find()
                        .then(user => {
                            expect(user).toHaveLength(2);
                            done();
                        }).catch(e => done(e));
                })
        });
    })
});
