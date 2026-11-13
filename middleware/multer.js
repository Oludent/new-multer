const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './gallery')

    },
    filename: (req, file, cb) =>{
        const date = Date.now()
        const randNumber = Math.floor(Math.random() * 1E8)
        const ext = file.originalname.split('.').pop()
        const filename = `IMG_${date}_${randNumber}.${ext}`
        cb(null, filename)
    }
})

const fileFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith('image/')){
        cb(null, true)
    }
    else{
        cb(new Error(`Image Only`))
    }
}

const limits = {
    fileSize: 1024 * 1024 * 10
}

const upload = multer({
    storage,
    fileFilter,
    limits
})

module.exports = upload