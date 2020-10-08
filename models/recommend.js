let mongoose = require('mongoose');
//let mongoosePaginate = require('mongoose-paginate');
//let bcrypt = require('bcrypt-nodejs');
let recommendSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    post: mongoose.Schema.Types.ObjectId,

    ranking: { type: Number }
  },
  { collection: 'recommend' }
);

let Recommend = mongoose.model('recommend', recommendSchema);
module.exports = Recommend;
