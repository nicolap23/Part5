import React from 'react';
import PropTypes from 'prop-types';

const BlogList = ({ blogs, updateBlogLikes, deleteBlog, user }) => {
  return (
    <div>
      {blogs.map((blog) => (
        <div key={blog._id}>
          <h2>{blog.title}</h2>
          <p>By {blog.author}</p>
          <p>{blog.url}</p>
          <p>Likes: {blog.likes}</p>
          <button onClick={() => updateBlogLikes(blog._id)}>
            Like
          </button>

          {/* Mostrar el botón de eliminar solo si el usuario logueado es el autor */}
          {user._id === blog.user._id && (
            <button onClick={() => deleteBlog(blog._id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
};

// Definir PropTypes para el componente BlogList
BlogList.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      likes: PropTypes.number.isRequired,
      user: PropTypes.shape({
        _id: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
  updateBlogLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default BlogList;
