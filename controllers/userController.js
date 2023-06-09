const asyncHandler = require("express-async-handler")
const bcrypt = require('bcryptjs')
const User = require('../models/userModel.js')
const Issue = require('../models/IssueModel.js')
const generateToken = require('../utils/generateToken.js')

// @desc Get All users from DB
// @route GET /api/users
// @access Public
const getAllUsers = asyncHandler(async(req,res)=>{
    try {
        const users = await User.find({})
        res.status(201).json(users);
    } catch (error) {
        res.status(500).json({
            status: "failure",
            message: error,
            payload: {}
        })
    }
})

// @desc register a new user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async(req,res) => {
    try {
        const {name, username, password} = req.body

        const exists = await User.findOne({username});

        if(exists){
            throw new Error("user already exists");
        }else{
            const user = await User.create({
                name,
                username,
                password
            })

            if(user){
                res.status(201).json({
                    status: "success",
                    message: "user created",
                    payload: user
                })
            }
        }

    } catch (error) {
        res.status(500).json({
            status: "failure",
            message: error,
            payload: {}
        })
    }
}) 


// @desc login user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req,res) => {
    try {

        const {username, password} = req.body;

        // check if user already exists
        const user = await User.findOne({username:username}).select('+password');
        if(!user){
            throw new Error("user does not exists");
        }

        //verify the password
        const isMatch = await user.matchPassword(password);


        if(!isMatch){
            res.json({
                status: "failure",
                message: "incorrect password"
            })
        }else{
            res.status(201).json({
                status: "success",
                payload : {
                    _id: user._id,
                    username: user.name,
                    token: generateToken(user._id)
                }
            })
        }

        
    } catch (error) {
        res.status(500).json({
            status: "failure",
            message: error,
            payload: {}
        })
    }

})

// @desc Create a new Issue
// @route POST /api/users/issue
// @access Protected
const createIssue = asyncHandler(async(req,res)=>{
    try {
        const {issue, title} = req.body;

        const newIssue = Issue.create({
            user: req.user._id,
            issue,
            title
        })

        if(newIssue){
            res.status(201).json({
                satus: "success",
                message: "issue created",
            })
        }


    } catch (error) {
        res.status(500).json({
            status: "failure",
            message: error,
            payload: {}
        })
    }
})



// @desc Add comments to issue
// @route PUT /api/users/issue/:id
// @access Protected
const addComments = asyncHandler(async (req,res)=>{
    try {
        
        const {comment} = req.body;
        const issueId = req.params.id

        const issue = await Issue.findById(issueId);

        if(issue){
            let newComment = {
                comment,
                userId: req.user._id
            }
            
            await Issue.updateOne({_id: issueId}, {$push:{comments: newComment}});


            res.status(200).json({
                status: "success",
                message: "comment added",
            })
           

        }else{
            throw new Error ("thread does not exist")
        }

    } catch (error) {
        res.status(500).json({
            status: "failure",
            message: error,
            payload: {}
        })
    }
})

// @desc Update likes to issue
// @route PUT /api/users/issue/:id/addlike
// @access Protected
const addLike = asyncHandler(async (req,res)=>{
    try {
        const issueId = req.params.id

        const issue = await Issue.findById(issueId);

        if(issue){    
            let like = issue.likes

            await Issue.updateOne({_id: issueId}, {$set:{likes: like+1}})
            
            res.status(200).json({
                status: "success",
                message: "Like added",
            })

        }else{
            throw new Error ("thread does not exist")
        }

    } catch (error) {
        res.status(500).json({
            status: "failure",
            message: error,
            payload: {}
        })
    }
})


// @desc get all Issues
// @route GET /api/users/issue/
// @access Protected
const getAllIssues = asyncHandler(async (req,res)=> {
    const issues = await Issue.find({});

    res.status(200).json(issues)
})


module.exports = {
    getAllUsers,
    registerUser,
    loginUser,
    createIssue,
    addComments,
    getAllIssues,
    addLike
}