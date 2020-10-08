let mongoose = require('mongoose');
let hobbySchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    name: String ,
    
    postId: [ String ]
  },
  { collection: 'hobby' }
);
let Hobby = mongoose.model('hobby', hobbySchema);
module.exports = Hobby;
