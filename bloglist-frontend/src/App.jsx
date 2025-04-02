import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import BlogList from "./components/BlogList";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";

const App = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    // Cargar blogs al inicio
    blogService.getAll().then((blogs) => {
      // Ordenar los blogs por likes de mayor a menor
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(sortedBlogs);
    });

    // Verificar si hay usuario en localStorage
    const loggedUserJSON = localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 5000);
  };

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials);
      localStorage.setItem("loggedUser", JSON.stringify(user)); // Guardar en localStorage
      setUser(user);
      showNotification(`Welcome ${user.name}!`, "success");
    } catch {
      showNotification("Invalid username or password", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedUser"); // Eliminar usuario de localStorage
    setUser(null); // Limpiar el estado
  };

  const createBlog = async (blogObject) => {
    try {
      const response = await blogService.create(blogObject, user.token);
      const updatedBlogs = [...blogs, response];
      // Ordenar los blogs nuevamente después de agregar uno nuevo
      const sortedBlogs = updatedBlogs.sort((a, b) => b.likes - a.likes);
      setBlogs(sortedBlogs); // Agregar nuevo blog a la lista
      showNotification(`Blog "${response.title}" added successfully!`, "success");
    } catch (error) {
      showNotification("Error creating blog", "error");
    }
  };

  const updateBlogLikes = async (id) => {
    try {
      const blogToUpdate = blogs.find((blog) => blog._id === id); // Asegúrate de que el campo sea "_id"
      const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1, // Incrementar el like
      };

      // Actualizar el blog en el backend
      const updatedBlogFromBackend = await blogService.updateBlog(id, updatedBlog);

      // Actualizar el estado en el frontend con la respuesta del backend
      const updatedBlogs = blogs.map((blog) => (blog._id === id ? updatedBlogFromBackend : blog));
      
      // Volver a ordenar los blogs después de actualizar un like
      const sortedBlogs = updatedBlogs.sort((a, b) => b.likes - a.likes);
      setBlogs(sortedBlogs); // Actualizar estado
      showNotification(`You liked "${updatedBlogFromBackend.title}"!`, "success");

    } catch (error) {
      showNotification("Error updating likes", "error");
    }
  };

  // Nueva función para eliminar un blog
  const deleteBlog = async (id) => {
    const blogToDelete = blogs.find((blog) => blog._id === id);
    
    // Verificar que el usuario que quiere eliminar el blog sea el mismo que lo creó
    if (blogToDelete.user._id !== user._id) {
      showNotification("You can only delete your own blogs", "error");
      return;
    }

    // Confirmación de eliminación
    const confirmDelete = window.confirm(`Are you sure you want to delete "${blogToDelete.title}"?`);
    
    if (confirmDelete) {
      try {
        await blogService.deleteBlog(id); // Eliminar blog en el backend
        const updatedBlogs = blogs.filter((blog) => blog._id !== id); // Filtrar el blog eliminado del estado
        setBlogs(updatedBlogs); // Actualizar estado
        showNotification(`Blog "${blogToDelete.title}" deleted successfully!`, "success");
      } catch (error) {
        showNotification("Error deleting blog", "error");
      }
    }
  };

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />

      {user === null ? (
        <LoginForm handleLogin={handleLogin} />
      ) : (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>Logout</button>
          <BlogForm createBlog={createBlog} />
          <BlogList 
            blogs={blogs} 
            updateBlogLikes={updateBlogLikes} 
            deleteBlog={deleteBlog} // Pasar la función de eliminación
            user={user} // Pasar el usuario para verificar la propiedad de los blogs
          />
        </div>
      )}
    </div>
  );
};

export default App;
