import { ObjectId } from 'mongodb'
import asyncHandler from 'express-async-handler'
import Attractions from '../model/attractionsModel.js'


//@desc submit
//@route Post /attractions
export const submit = asyncHandler(async (req, res, next) => {
  const { name, description, image } = req.query
  if(!name || !description || !image) {
    const error = new Error('未获得所需数据')
    error.status = 400
    return next(error)
  }

  const checkOfUniqueness = await Attractions.findOne({ name })
  if (checkOfUniqueness) {
    const error = new Error('已存在此景点')
    error.status = 400
    return next(error)
  }

  try {
    const tourData = await Attractions.create({
      name, 
      description,
      image
    })
    res.status(201).json({
      message: '景点提交成功',
      data: {
        name: tourData.name,
        description: tourData.description,
        image: tourData.image,
        exclusiveID: tourData.exclusiveID
      }
    })
  } catch (err) {
    console.log(err)
    const error = new Error('服务器错误')
    error.status = 500
    return next(error)
  }
  
})

//@desc getAttractionsList
//@route Get /attractions/page
export const getAttractionsList = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page)
  const size = parseInt(req.query.size)
  if(!page || !size) {
    const error = new Error('未获得所需数据')
    error.status = 400
    return next(error)
  }

  try {
    // 总景点数量
    const totalAttractions = await Attractions.countDocuments()
    // 总页数
    const skipPages = (page - 1) * size
    const totalPages = Math.ceil(totalAttractions / size)
    const attractions = (skipPages >= totalAttractions) ? await Attractions.find() : await Attractions.find().skip(skipPages).limit(size)
    
    const data = attractions.map(attraction => ({
      name: attraction.name,
      description: attraction.description,
      image: attraction.image,
      exclusiveID: attraction.exclusiveID
    }))

    res.status(200).json({
      message: '获取成功',
      total: totalAttractions,
      data
    })

  } catch (err) {
    console.log(err)
    const error = new Error('服务器错误')
    error.status = 500
    return next(error)
  }
})