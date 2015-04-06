var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    provider: String,
    provider_id: {type: String, unique: true},
    photo: String,
    cretatedAt: {type: Date, default: Date.now}
});

var UserSchema = mongoose.model('User', UserSchema);

module.exports = UserSchema;