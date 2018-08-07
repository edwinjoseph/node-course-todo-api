const request = require('supertest');
const { ObjectID } = require('mongodb');

const mongoose = require('../../../../src/server/db/mongoose');
const app = require('../../../../src/server/app');
const Todo = require('../../../../src/server/models/todo');

const todos = [
    {
        _id: new ObjectID(),
        text: "First test todo"
    },
    {
        _id: new ObjectID(),
        text: "Second test todo"
    }
];

beforeEach(done => {
   Todo.remove({}).then(() => {
       return Todo.insertMany(todos);
   }).then(() => done());
});

afterAll(done => {
    mongoose.close(done);
});

describe('src/server/routes/api/todos.js', () => {
    describe('POST /api/v1/todos', () => {
        test('should create a new todo', done => {
            const text = 'Todo text';
            request(app)
                .post('/api/v1/todos')
                .send({ text })
                .expect(200)
                .expect(res => {
                    expect(res.body.text).toBe(text);
                })
                .end((err) => {
                    if (err) {
                        done(err);
                    }
                    Todo.find({text})
                        .then(todos => {
                            expect(todos).toHaveLength(1);
                            expect(todos[0]).toMatchObject({ text });
                            done();
                        }).catch(e => done(e));
                })
        });
        test('should not create a new todo with invalid data', done => {
            request(app)
                .post('/api/v1/todos')
                .send({})
                .expect(400)
                .end((err) => {
                    if (err) {
                        done(err);
                    }
                    Todo.find()
                        .then(todos => {
                            expect(todos).toHaveLength(2);
                            done();
                        }).catch(e => done(e));
                })
        });
    });
    describe('GET /api/v1/todos', () => {
       test('should return all todos', done => {
           request(app)
               .get('/api/v1/todos')
               .expect(200)
               .expect(res => {
                   expect(res.body.todos).toHaveLength(2);
               })
               .end(done)
       })
    });
    describe('GET /api/v1/todos/:id', () => {
        test('should return a todo object', done => {
           const id = todos[0]._id.toHexString();
           request(app)
               .get(`/api/v1/todos/${id}`)
               .expect(200)
               .expect(res => {
                   expect(res.body.todo).toMatchObject({
                       text: 'First test todo'
                   });
               })
               .end(done)
        });
        test('should return a 404 if ID is not found', done => {
            const id = new ObjectID().toHexString();
            request(app)
                .get(`/api/v1/todos/${id}`)
                .expect(404)
                .expect(res => {
                    expect(res.body.error.message).toBe('Todo not found.');
                })
                .end(done)
        });
        test('should return a 404 if ID is not valid', done => {
            request(app)
                .get(`/api/v1/todos/123`)
                .expect(404)
                .expect(res => {
                    expect(res.body.error.message).toBe('Todo not found.');
                })
                .end(done)
        });
    });
    describe('DELETE /api/v1/todos/:id', () => {
        test('should delete a todo object', done => {
           const id = todos[0]._id.toHexString();
           request(app)
               .delete(`/api/v1/todos/${id}`)
               .expect(200)
               .end((err) => {
                   if (err) {
                       done(err);
                   }
                   Todo.findById(id)
                       .then(todo => {
                           expect(todo).toBeNull();
                           done();
                       }).catch(e => done(e));
               })
        });
        test('should return a 404 if ID is not found', done => {
            const id = new ObjectID().toHexString();
            request(app)
                .delete(`/api/v1/todos/${id}`)
                .expect(404)
                .expect(res => {
                    expect(res.body.error.message).toBe('Todo not found.');
                })
                .end(done)
        });
        test('should return a 404 if ID is not valid', done => {
            request(app)
                .delete(`/api/v1/todos/123`)
                .expect(404)
                .expect(res => {
                    expect(res.body.error.message).toBe('Todo not found.');
                })
                .end(done)
        });
    });
    describe('PATCH /api/v1/todos/:id', () => {
        test('should update a todo object', done => {
            const id = todos[0]._id.toHexString();
            Todo.findById(id).then(todo => {
                expect(todo).toMatchObject({ text: 'First test todo' });
            });
            request(app)
                .patch(`/api/v1/todos/${id}`)
                .send({ text: 'Hello there!' })
                .expect(200)
                .end((err) => {
                    if (err) {
                        done(err);
                    }
                    Todo.findById(id).then(todo => {
                        expect(todo).toMatchObject({ text: 'Hello there!' });
                        done();
                    }).catch(e => done(e));
                })
        });
        test('should add a completedAt timestamp if completed is true', done => {
            const id = todos[0]._id.toHexString();
            Todo.findById(id).then(todo => {
                expect(todo).toMatchObject({ completed: false, completedAt: null });
            });
            request(app)
                .patch(`/api/v1/todos/${id}`)
                .send({ completed: true })
                .expect(200)
                .end((err) => {
                    if (err) {
                        done(err);
                    }
                    Todo.findById(id).then(todo => {
                        expect(todo.completed).toBe(true);
                        expect(todo.completedAt).toBeDefined();
                        done();
                    }).catch(e => done(e));
                })
        });
        test('should clear the completedAt timestamp if completed is false', done => {
            const id = todos[0]._id.toHexString();
            Todo.findById(id).then(todo => {
                expect(todo).toMatchObject({ completed: false, completedAt: null });
            });
            request(app)
                .patch(`/api/v1/todos/${id}`)
                .send({ completed: true })
                .expect(200)
                .end((err) => {
                    if (err) {
                        done(err);
                    }
                    Todo.findById(id).then(todo => {
                        expect(todo.completed).toBe(true);
                        expect(todo.completedAt).toBeDefined();
                        done();
                    }).catch(e => done(e));
                })
        });
        test('should return a 404 if ID is not found', done => {
            const id = new ObjectID().toHexString();
            request(app)
                .patch(`/api/v1/todos/${id}`)
                .expect(404)
                .expect(res => {
                    expect(res.body.error.message).toBe('Todo not found.');
                })
                .end(done)
        });
        test('should return a 404 if ID is not valid', done => {
            request(app)
                .patch(`/api/v1/todos/123`)
                .expect(404)
                .expect(res => {
                    expect(res.body.error.message).toBe('Todo not found.');
                })
                .end(done)
        });
    });
});
