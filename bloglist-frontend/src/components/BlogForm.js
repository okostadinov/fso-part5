import { useState } from 'react';

const BlogForm = ({ addBlog, callback: toggleVisibility }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleAddBlog = (e) => {
    e.preventDefault();

    addBlog(title, url);
    setTitle('');
    setUrl('');
    toggleVisibility();
  };

  return (
    <form id="blogForm" onSubmit={handleAddBlog}>
      <h2>create new</h2>
      <div>
        <label>
          title:
          <input
            type="text"
            name="title"
            id="title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          url:
          <input
            type="text"
            name="url"
            id="url"
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
      </div>
      <button id="createBlogBtn" type="submit">create</button>
    </form>
  );
};

export default BlogForm;
