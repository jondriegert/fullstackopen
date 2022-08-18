const Blog = ({ blog }) => {
  return (
    <div className="blog">
      <div>
        {blog.title} {blog.author}
      </div>
    </div>
  );
};

export default Blog;
