var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    email: {type: String, unique: true},
    bio: String,
    city: String,
    provider: String,
    provider_id: {type: String, unique: true},
    photo: String,
    createdAt: {type: Date, default: Date.now}
});

var UserSchema = mongoose.model('User', UserSchema);

module.exports = UserSchema;