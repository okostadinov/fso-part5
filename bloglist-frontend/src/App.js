import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Message from './components/Message';
import Toggleable from './components/Toggleable';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [messageState, setMessageState] = useState(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const attemptLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      blogService.setToken(user.token);
      window.localStorage.setItem('loggedUser', JSON.stringify(user));
      setUser(user);
      handleMessage(true, 'logged in successfully');
    } catch (ex) {
      handleMessage(false, ex.response.data.error);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser');
    window.location.reload();
  };

  const addBlog = async (title, url) => {
    const returnedBlog = await blogService.create({ title, url });
    setBlogs(blogs.concat(returnedBlog));
    handleMessage(true, `a new blog ${returnedBlog.title} was added`);
  };

  /**
   * Passed to each <Blog /> to be called when the blog is deleted.
   * @param {Blog Object} deletedBlog
   */
  const updateBlogsAfterDeletion = (deletedBlog) => {
    setBlogs((blogs) => blogs.filter((blog) => blog !== deletedBlog));
  };

  const handleMessage = (state, text) => {
    setMessageState(state);
    setMessageText(text);

    setTimeout(() => {
      setMessageText('');
    }, 3000);
  };

  return (
    <>
      {messageText && <Message text={messageText} state={messageState} />}
      {user === null ? (
        <Toggleable buttonLabel="login">
          <LoginForm attemptLogin={attemptLogin} />
        </Toggleable>
      ) : (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} logged in{' '}
            <button href="/" onClick={handleLogout}>
              logout
            </button>
          </p>
          <Toggleable buttonLabel="add blog">
            <BlogForm addBlog={addBlog} />
          </Toggleable>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              initBlog={blog}
              updateBlogs={updateBlogsAfterDeletion}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default App;
