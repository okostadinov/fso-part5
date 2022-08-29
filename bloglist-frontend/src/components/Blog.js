import { useState } from 'react';
import blogService from '../services/blogs';

// eslint-disable-next-line no-unused-vars
const Blog = ({ initBlog, updateBlogs, mockfn }) => {
  const [detailed, setDetailed] = useState(false);
  const [blog, setBlog] = useState(initBlog);
  const [likes, setLikes] = useState(initBlog.likes);

  const blogStyle = {
    padding: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLike = async () => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author.id,
      url: blog.url,
      likes: blog.likes + 1,
      id: blog.id,
    };
    setLikes(likes + 1);
    const returnedBlog = await blogService.update(updatedBlog);
    setBlog(returnedBlog);
  };

  const handleDelete = async () => {
    await blogService.remove(blog);
    updateBlogs(blog);
  };

  return (
    <>
      {detailed ? (
        <div className="blog" style={blogStyle}>
          <div>
            {blog.title} {blog.author.name}{' '}
            <button onClick={() => setDetailed(!detailed)}>hide</button>
          </div>
          <div>{blog.url}</div>
          <div>
            likes {likes}{' '}
            <button className="like-btn" onClick={handleLike}>
              like
            </button>
          </div>
          <button className="delete-btn" onClick={handleDelete}>delete</button>
        </div>
      ) : (
        <div className="blog" style={blogStyle}>
          <div>
            {blog.title} {blog.author.name}{' '}
            <button onClick={() => setDetailed(!detailed)}>view</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Blog;
