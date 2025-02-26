import { ObjectId } from 'mongodb'
import asyncHandler from 'express-async-handler'
import Tours from '../model/toursModel.js'
// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'

//@desc submit
//@route Post /tours
export const submit = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body
  const image = req.file ? req.file.path : null
  if(!name || !description || !image) {
    const error = new Error('未获得所需数据')
    error.status = 400
    return next(error)
  }

  const checkOfUniqueness = await Tours.findOne({ name })
  if (checkOfUniqueness) {
    const error = new Error('已存在此旅行团')
    error.status = 400
    return next(error)
  }

  const tourData = await Tours.create({
    name, 
    description,
    image
  })

  if (tourData) {
    res.status(201).json({
      message: '旅游团提交成功',
      data: {
        name: tourData.name,
        description: tourData.description,
        image: tourData.image,
        exclusiveID: tourData.exclusiveID
      }
    })
  } else {
    const error = new Error('服务器错误')
    error.status = 500
    return next(error)
  }
})

//@desc getToursList
//@route Get /tours/page
export const getToursList = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page)
  const size = parseInt(req.query.size)
  if(!page || !size) {
    const error = new Error('未获得所需数据')
    error.status = 400
    return next(error)
  }

  try {
    // 总旅游团数量
    const totalTours = await Tours.countDocuments()
    // 总页数
    const skipPages = (page - 1) * size
    const tours = (skipPages >= totalTours) ? await Tours.find() : await Tours.find().skip(skipPages).limit(size)
    
    const data = tours.map(tour => ({
      name: tour.name,
      description: tour.description,
      image: `http://localhost:3000/${tour.image.replace(/\\/g, '/')}`,
      exclusiveID: tour.exclusiveID
    }))

    res.status(200).json({
      message: '获取成功',
      total: totalTours,
      data
    })
  } catch (err) {
    console.log(err)
    const error = new Error('服务器错误')
    error.status = 500
    return next(error)
  }
})