const request = require('supertest');

const app = require('../../../../../src/server/server.js');
const Todo = require('../../../../../src/server/models/todo');

const todos = [{ text: "First test todo" }, { text: "Second test todo" }];


beforeEach(done => {
   Todo.remove({}).then(() => {
       return Todo.insertMany(todos);
   }).then(() => done());
});
describe('src/server/routes/api/v1/todos.js', () => {
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
});
