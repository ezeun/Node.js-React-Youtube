const express = require('express');
const router = express.Router();
const {  Comment } = require("../models/Comment");

//=================================
//             Comment
//=================================

router.post("/saveComment", (req, res) => {
    
    const comment = new Comment(req.body)

    comment.save((err, comment)=> {
        if(err) return res.json({ success: false, err})

        Comment.find({'_id' : comment._id})
            .populate('writer') //writer의 모든 정보를 가져옴
            .exec((err, result) => {
                if(err) return res.json({ success: false, err})
                res.status(200).json({ success: true, result })
            })
    })
});

router.post("/getComments", (req, res) => {
    
    Comment.find({'postId' : req.body.videoId})
        .populate('writer') //writer의 모든 정보를 가져옴
        .exec((err, comments) => { //postId의 모든 comment정보들 가져오기
            if(err) return res.status(400).send(err)
            res.status(200).json({ success: true, comments })
        })

});

module.exports = router;
