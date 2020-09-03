let mongoose = require('mongoose');
const crypto = require('crypto');
//let mongoosePaginate = require('mongoose-paginate');
//let bcrypt = require('bcrypt-nodejs');
let accountSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    ID: { type: String },

    PW: { type: String },
    
    salt: {type: String},

    birthday: {type : Date},
    
    check: {type: String},
    
    proImage : {
       contentType: String,
       dataurl: String
      }
  },
  { collection: 'account' }
);


//accountSchema.plugin(mongoosePaginate);
accountSchema.methods.comparePassword = function(passw, cb) {
  return crypto.pbkdf2(passw, this.salt, 100000, 64, 'sha512', (err, key)=>{
    if(this.PW === key.toString('base64')){
      return cb(null, true)
    } else {
      return cb(null, false)
    }
  });
  
};

let Account = mongoose.model('account', accountSchema);
module.exports = Account;
