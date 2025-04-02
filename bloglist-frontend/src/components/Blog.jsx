import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, updateBlogLikes }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  // ✅ Función para manejar el like
  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1, // Aumentar likes en 1
    };

    try {
      await blogService.updateBlog(blog.id, updatedBlog);
      updateBlogLikes(blog.id, updatedBlog.likes);
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  return (
    <div style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
      <p>
        {blog.title} by {blog.author}{" "}
        <button onClick={toggleVisibility}>{visible ? "Hide" : "View"}</button>
      </p>
      {visible && (
        <div>
          <p>URL: {blog.url}</p>
          <p>
            Likes: {blog.likes} <button onClick={handleLike}>Like</button>
          </p>
        </div>
      )}
    </div>
  );
};

export default Blog;
