var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    user_id: { type: Schema.ObjectId, ref: "User"},
    title: String,
    description: String,
    content: String,
    visible: Boolean,
    saved: Boolean,
    deleted: {type: Boolean, default: false },
    permalink: String,
    created_at: { type: Date, default: Date.now },
    edited_at: { type: Date, default: Date.now },
    tags : [],
    comments: {
        user_id: { type: Schema.ObjectId, ref: "User" },
        comment: String,
        date: Date
    }
});

var ArticleSchema = mongoose.model('Article', ArticleSchema);
module.exports = ArticleSchema;