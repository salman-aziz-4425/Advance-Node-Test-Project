jest.setTimeout(30000) // we saw every test for about 30 seconds

require('../models/User')

const mongoose = require('mongoose');

const keys = require('../config/keys');


mongoose.Promise = global.Promise // for administrative work and for record

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})



