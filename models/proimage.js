let mongoose = require('mongoose');

let ImageSchema = mongoose.Schema(
  {
    img: { contentType: String, data: Buffer }
    
  }
)


let proImage = mongoose.model('proimage', ImageSchema);
module.exports = proImage;
