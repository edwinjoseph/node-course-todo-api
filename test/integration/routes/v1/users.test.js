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

describe('src/server/routes/v1/users.js', () => {
    describe('POST /v1/users', () => {
        test('should create a new user', done => {
            const user = {
                email: 'edwin3@mailinator.com',
                password: 'password3'
            };

            request(app)
                .post('/v1/users')
                .send(user)
                .expect(200)
                .expect(res => {
                    expect(res.headers['x-auth']).toBeDefined();
                    expect(res.body._id).toBeDefined();
                    expect(res.body.email).toBe(user.email);
                })
                .end((err) => {
                    if (err) {
                        done(err);
                    }
                    User.findOne({ email: user.email })
                        .then(res => {
                            expect(res).toBeDefined();
                            expect(res.password).not.toBe(user.password);
                            done();
                        }).catch(e => done(e));
                })
        });
        test('should not create a new user with invalid data', done => {
            request(app)
                .post('/v1/users')
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
        test('should not create a new user if email is in use', done => {
            request(app)
                .post('/v1/users')
                .send({
                    email: users[0].email,
                    password: 'password'
                })
                .expect(400)
                .expect(res => {
                    expect(res.body).toMatchObject(createError('email', 'ERREMAILEXISTS'));
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
    });
    describe('GET /v1/users/me', () => {
        test('should return user if authenticated', done => {
            const user = users[0];
            request(app)
                .get('/v1/users/me')
                .set('x-auth', user.tokens[0].token)
                .expect(200)
                .expect(res => {
                    expect(res.body._id).toBe(user._id.toHexString());
                    expect(res.body.email).toBe(user.email);
                })
                .end(err => {
                    if (err) {
                        done(err);
                    }
                    done();
                })
        });
        test('should return 401 if not authenticated', done => {
            request(app)
                .get('/v1/users/me')
                .expect(401)
                .expect(res => {
                    expect(res.body).toMatchObject(createError('token', 'ERRNOAUTH'))
                })
                .end(err => {
                    if (err) {
                        done(err);
                    }
                    done();
                })
        });
    });
});
