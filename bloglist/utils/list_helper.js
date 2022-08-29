const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  const blogLikesReducer = (sumLikes, nextBlog) => sumLikes + nextBlog.likes;

  return blogs.length === 0 ? 0 : blogs.reduce(blogLikesReducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  let favorite = blogs[0];

  blogs.forEach((blog) => {
    if (blog.likes > favorite.likes) {
      favorite = blog;
    }
  });

  return favorite;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  let results = [];

  blogs.forEach((blog) => {
    const result = results.find((res) => res.author === blog.author);

    if (result) {
      result.blogs += 1;
    } else {
      results.push({ author: blog.author, blogs: 1 });
    }
  });

  return results.sort((res1, res2) => res2.blogs - res1.blogs)[0];
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  let results = [];

  blogs.forEach((blog) => {
    const result = results.find((res) => res.author === blog.author);

    if (result) {
      result.likes += blog.likes;
    } else {
      results.push({ author: blog.author, likes: blog.likes });
    }
  });

  return results.sort((res1, res2) => res2.likes - res1.likes)[0];
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
