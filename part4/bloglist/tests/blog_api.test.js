const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');

let authToken;

beforeEach(async () => {
  await User.deleteMany({});

  // for (let user of helper.initialUsers) {
  //   let userObject = User(user);
  //   await userObject.save();
  // }
  for (let user of helper.initialUsers) {
    let userObject = User(user);
    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  }

  await Blog.deleteMany({});

  // for (let blog of helper.initialBlogs) {
  //   let blogObject = Blog(blog);
  //   await blogObject.save();
  // }

  const login = {
    username: helper.initialUsers[0].username,
    password: helper.initialUsers[0].password,
  };

  const response = await api
    .post('/api/login')
    .send(login)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  authToken = response.body.token;

  for (let addBlog of helper.initialBlogs) {
    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + authToken)
      .send(addBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  }
});

test('dummy test', async () => {
  expect(1).toBe(1);
}, 5000);

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('verify id property named "id" exists', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body[0].id).toBeDefined();
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'test blog',
    author: 'blog tester',
    url: 'http://test.com',
    likes: 1,
  };

  await api
    .post('/api/blogs')
    .set('Authorization', 'bearer ' + authToken)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  // const title = blogsAtEnd.map((n) => n.title);
  // expect(title).toContain('test blog');

  const allBlogs = blogsAtEnd.map((n) =>
    JSON.stringify({
      title: n.title,
      author: n.author,
      url: n.url,
      likes: n.likes,
    })
  );
  expect(allBlogs).toContain(JSON.stringify(newBlog));
});

test('no token returns 401', async () => {
  const newBlog = {
    title: 'bad test blog',
    author: 'bad blog tester',
    url: 'http://test.com/bad',
    likes: 1,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/);
});

test('missing likes property defaults to 0', async () => {
  const newBlog = {
    title: 'test blog 2',
    author: 'blog tester',
    url: 'http://test.com',
  };

  const response = await api
    .post('/api/blogs')
    .set('Authorization', 'bearer ' + authToken)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  expect(response.body.likes).toBe(0);
});

test('missing title and url returns 400 bad request', async () => {
  const newBlog = {
    author: 'blog tester 3',
    likes: 1,
  };

  const response = await api
    .post('/api/blogs')
    .set('Authorization', 'bearer ' + authToken)
    .send(newBlog)
    .expect(400);
});

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'bearer ' + authToken)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    // const contents = blogsAtEnd.map((r) => r.content);

    // expect(contents).not.toContain(blogToDelete.content);

    const allBlogs = blogsAtEnd.map((n) =>
      JSON.stringify({
        title: n.title,
        author: n.author,
        url: n.url,
        likes: n.likes,
      })
    );
    expect(allBlogs).not.toContain(JSON.stringify(blogToDelete));
  });
});

describe('modify a blog', () => {
  test('changing and checking likes', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToModify = blogsAtStart[0];

    const newLikes = blogToModify.likes + 1;

    const modifiedBlog = {
      title: blogToModify.title,
      author: blogToModify.author,
      url: blogToModify.url,
      likes: newLikes,
    };

    await api
      .put(`/api/blogs/${blogToModify.id}`)
      .send(modifiedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const allBlogs = blogsAtEnd.map((n) =>
      JSON.stringify({
        title: n.title,
        author: n.author,
        url: n.url,
        likes: n.likes,
      })
    );
    expect(allBlogs).toContain(JSON.stringify(modifiedBlog));
    expect(blogsAtStart.length).toBe(blogsAtEnd.length);
  });
});

describe('test the users db', () => {
  test('all users are returned', async () => {
    const response = await api.get('/api/users');

    expect(response.body).toHaveLength(helper.initialUsers.length);
  });

  test('username missing returns 400 bad request', async () => {
    const invalidUser = {
      name: 'invalid User 1',
      password: 'password1',
    };

    const response = await api.post('/api/users').send(invalidUser).expect(400);
  });

  test('password missing returns 400 bad request', async () => {
    const invalidUser = {
      username: 'invalid2',
      name: 'invalid User 2',
    };

    const response = await api.post('/api/users').send(invalidUser).expect(400);
  });

  test('username < 3 characters returns 400 bad request', async () => {
    const invalidUser = {
      username: 'i3',
      name: 'invalid User 3',
      password: 'password3',
    };

    const response = await api.post('/api/users').send(invalidUser).expect(400);
  });

  test('password < 3 characters returns 400 bad request', async () => {
    const invalidUser = {
      username: 'invalid4',
      name: 'invalid User 4',
      password: 'p4',
    };

    const response = await api.post('/api/users').send(invalidUser).expect(400);
  });
});
