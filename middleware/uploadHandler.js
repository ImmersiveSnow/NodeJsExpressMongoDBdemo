import multer from 'multer'
import path from 'path'

// 设置存储引擎
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})

// 初始化上传
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5, files: 1 } // 限制文件大小为5MB
})

export default upload