const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? null
    : blogs.reduce((sum, blog) => {
        if (blog.likes > sum.likes) sum = blog;
        return sum;
      }, blogs[0]);
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  let authorMap = {};
  let maxAuthor = null;
  let maxBlogs = 0;

  for (let i = 0; i < blogs.length; i++) {
    const currentBlog = blogs[i];

    if (!authorMap[currentBlog.author]) {
      authorMap[currentBlog.author] = 1;
    } else {
      authorMap[currentBlog.author]++;
    }

    if (authorMap[currentBlog.author] > maxBlogs) {
      maxAuthor = currentBlog;
      maxBlogs = authorMap[currentBlog.author];
    }
  }

  return { author: maxAuthor.author, blogs: maxBlogs };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  let authorMap = {};
  let maxAuthor = null;
  let maxLikes = 0;

  for (let i = 0; i < blogs.length; i++) {
    const currentBlog = blogs[i];

    if (!authorMap[currentBlog.author]) {
      authorMap[currentBlog.author] = currentBlog.likes;
    } else {
      authorMap[currentBlog.author] += currentBlog.likes;
    }

    if (authorMap[currentBlog.author] > maxLikes) {
      maxAuthor = currentBlog;
      maxLikes = authorMap[currentBlog.author];
    }
  }

  return { author: maxAuthor.author, likes: maxLikes };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
