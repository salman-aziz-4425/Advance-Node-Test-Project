const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const { clearHash } = require('../services/cache')

const clearCache = require('../middlewares/cacheMiddle')

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {

    const blogs = await Blog.find({ _user: req.user.id })
      .cache({ key: req.user.id }) // passing to our options

    res.send(blogs)

    // client.get = utils.promisify(client.get) // it promisified callback functions extract result that otherwise will be in particular function callback

    // const cachedBlogs = await client.get(req.user.id)

    // if (cachedBlogs) {
    //   return res.send(cachedBlogs)
    // }

    // const blogs = await Blog.find({ _user: req.user.id });

    // client.set(req.user.id, JSON.stringify(blogs))

    // res.send(blogs);
  });

  app.post('/api/blogs', requireLogin, clearCache, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
    clearHash(req.user.id)
  });
};
