import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import Blog from './Blog';

const sortBlogs = (blogs) => {
  return blogs.sort((a, b) => {
    return b.likes - a.likes;
  });
};

const BlogList = ({ user }) => {
  const blogs = sortBlogs([...useSelector((state) => state.blogs)]);

  return (
    <>
      <Table striped>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td>
                <Link to={`/blogs/${blog.id}`}>
                  <Blog blog={blog} user={user} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default BlogList;
