const express = require('express');
const router = express.Router();
//const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");

//STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    destination: (req, file, cb) => { //어디에 파일을 저장할지 
        cb(null, "uploads/"); //uploads 폴더에 저장
    },
    filename: (req, file, cb) => { //어떤 파일명으로 저장할건지
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext !== '.mp4'){
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

const upload = multer({ storage: storage }).single("file");


//=================================
//             Video
//=================================

router.post("/uploads", (req, res) => { //req을 통해 files를 받음
    
    //비디오를 서버에 저장한다
    upload(req, res, err => {
        if(err){
            return res.json({ success: false, err})
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
    })
});


module.exports = router;
