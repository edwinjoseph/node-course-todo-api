const request = require('supertest');
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
    describe('POST /v1/users/login', () => {
        test('should login user and return auth token', done => {
            const user = users[1];
            request(app)
                .post('/v1/users/login')
                .send({ email: user.email, password: user.password })
                .expect(200)
                .expect(res => {
                    expect(res.headers['x-auth']).toBeDefined();

                })
                .end((err, res) => {
                   if (err) {
                       done(err);
                   }
                    User.findById(user._id)
                        .then(usr => {
                            expect(usr.tokens[0]).toMatchObject({
                                access: 'auth',
                                token: res.headers['x-auth']
                            });
                            done();
                        }).catch(e => done(e));
                });
        });
        test('should reject invalid login ', done => {
            const user = users[1];
            request(app)
                .post('/v1/users/login')
                .send({ email: user.email, password: 'abc123' })
                .expect(400)
                .expect(res => {
                    expect(res.headers['x-auth']).toBeUndefined();

                })
                .end(err => {
                    if (err) {
                        done(err);
                    }
                    User.findById(user._id)
                        .then(usr => {
                            expect(usr.tokens.length).toBe(0);
                            done();
                        }).catch(e => done(e));
                });
        });
    });
    describe('POST /v1/users/logout', () => {
        test('should remove auth token on logout', done => {
            const user = users[0];
            request(app)
                .post('/v1/users/logout')
                .set('x-auth', user.tokens[0].token)
                .expect(200)
                .end(err => {
                    if (err) {
                        done(err);
                    }
                    User.findById(user._id)
                        .then(usr => {
                            expect(usr.tokens.length).toBe(0);
                            done();
                        }).catch(e => done(e));
                })
        });
    })
});
