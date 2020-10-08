let mongoose = require('mongoose');
//let mongoosePaginate = require('mongoose-paginate');
//let bcrypt = require('bcrypt-nodejs');
let postsSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    author: mongoose.Schema.Types.ObjectId,

    date: { type: Date },

    comments : [{
      author: mongoose.Schema.Types.ObjectId,
      description: String
    }],

    post: [{
      page: Number,
      filepath: String,
      description: String
    }],

    Like: [ mongoose.Schema.Types.ObjectId],
    
    tags: [ String ],
    
    viewed: [ mongoose.Schema.Types.ObjectId ]
  },
  { collection: 'posts' }
);

let Posts = mongoose.model('posts', postsSchema);
module.exports = Posts;
