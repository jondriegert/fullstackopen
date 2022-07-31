const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body;

  const user = request.user;
  if (!user) return response.status(401).json({ error: 'invalid token' });

  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  if (!blog.title || !blog.url) {
    response.status(400).end();
  } else {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  }
});

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const body = request.body;
    const token = request.token;
    let decodedToken;
    const user = request.user;
    if (!user) return;

    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(401).json({ error: 'blog not found' });
    }

    if (blog.user.toString() === user._id.toString()) {
      await blog.delete();
      response.status(204).end();
    } else {
      return response.status(401).json({ error: 'wrong user' });
    }
  }
);

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body;

  const blog = await Blog.findById(request.params.id);

  blog.author = body.author;
  blog.title = body.title;
  blog.url = body.url;
  blog.likes = body.likes;

  const updatedBlog = await blog.save();

  response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
