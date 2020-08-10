let mongoose = require('mongoose');
//let mongoosePaginate = require('mongoose-paginate');
//let bcrypt = require('bcrypt-nodejs');
let accountSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    ID: { type: String },

    PW: { type: String },
    
    proImage : { contentType: String, data: Buffer }
  },
  { collection: 'account' }
);


//accountSchema.plugin(mongoosePaginate);
accountSchema.methods.comparePassword = function(passw, cb) {
  if (this.PW == passw) {
    cb(null, true);
  } else {
    return cb(null, false);
  }
};

let Account = mongoose.model('account', accountSchema);
module.exports = Account;
