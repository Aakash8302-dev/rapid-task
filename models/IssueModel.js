const mongoose = require('mongoose');

const IssueSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    title:{
        type: String,
        required: true
    },  
    issue:{
        type: String,
        required: true
    },
    comments: [
        {
            comment:{
                type: String
            },
            userId:{
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            },
        }
    ],
    likes:{
        type: Number,
        default: 0
    }
},
{ timestamps: true }
)

const Issue = mongoose.model('Issue', IssueSchema, 'Issues');
module.exports = Issue;