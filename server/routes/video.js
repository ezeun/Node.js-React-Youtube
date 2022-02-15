const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");

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
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename }) //성공
    })
});

router.post("/uploadVideo", (req, res) => { 
    
    //비디오 정보들을 mongoDB에 저장한다

    const video = new Video(req.body) //req.body : client에서 보낸 variables 모든 정보
    video.save((err, doc)=> {  //mongoDB 메소드를 이용해서 모든 정보를 mongoDB에 저장
        if(err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })
});

router.get("/getVideos", (req, res) => { 
    
    //비디오를 DB에서 가져와서 클라이언트에 보낸다
    Video.find()
        .populate('writer')
        .exec((err, videos)=> {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos})
        })
});

router.post("/thumbnail", (req, res) => { 
    
    //썸네일을 생성하고 비디오 러닝타임 정보도 가져오기
    
    let filePath ="";
    let fileDuration = ""

    //비디오 정보 가져오기
    //ffmpeg.setFfmpegPath('C:\\..\\..\\bin\\ffmpeg.exe')
    ffmpeg.ffprobe(req.body.url, function (err, metadata){
        console.dir(metadata); //all metadata
        console.log(metadata.format.duration);

        fileDuration = metadata.format.duration;
    });

    //썸네일 생성
    ffmpeg(req.body.url) //url : 클라이언트에서 온 비디오 저장 경로(uploads)
    .on('filenames', function (filenames) { //비디오 썸네일 파일명 생성
        console.log('Will generate ' + filenames.join(', '))
        console.log(filenames)

        filePath = "uploads/thumbnails/" + filenames[0] 
    })
    .on('end', function () { //썸네일 생성 후 하는 일들
        console.log('Screenshots taken');
        return res.json({ success: true, url: filePath, fileDuration: fileDuration }); //성공
    })
    .on('error', function (err) { //에러 발생 시
        console.error(err);
        return res.json({ success: false, err });
    })
    .screenshots({
        //Will take screenshots at 20%, 40%, 60% and 80% of the video
        count: 3, //몇 개의 썸네일을 찍을 지
        folder: 'uploads/thumbnails', //uploads/thumbnails/ 여기에 썸네일이 저장됨
        size: '320x240',
        //'%b': input basename (filename w/o extension)
        filename: 'thumbnail-%b.png'
    })
});

module.exports = router;
