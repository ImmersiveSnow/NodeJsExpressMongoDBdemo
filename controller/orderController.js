import asyncHandler from 'express-async-handler'
import Orders from '../model/ordersModel.js'
import Tours from '../model/toursModel.js'
import Users from '../model/usersModel.js'

//@desc getOrdersList
//@route Get /orders/page
export const getOrdersList = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page)
  const size = parseInt(req.query.size)
  const userId = req.query.userId
  if(!page || !size || !userId) {
    const error = new Error('未获得所需数据')
    error.status = 400
    return next(error)
  }

  try {
    const checkUid = await Orders.findOne({ userId: userId })
    if (!checkUid) {
      const error = new Error('未找到此用户')
      error.status = 400
      return next(error)
    }
    const totalOrders = await Orders.countDocuments()
    // 总页数
    const skipPages = (page - 1) * size
    const totalPages = Math.ceil(totalOrders / size)
    const orders = (skipPages >= totalOrders) ? await Orders.find({ userId: userId }) : await Orders.find({ userId: userId }).skip(skipPages).limit(size)
    
    const data = orders.map(order => ({
      name: order.name,
      description: order.description,
      image: order.image,
      number: order.number,
      time: order.time,
      orderID: order.orderId,
      exclusiveID: order.exclusiveID
    }))

    res.status(200).json({
      message: '获取成功',
      total: totalOrders,
      data
    })
  } catch (err) {
    console.log(err)
    const error = new Error('服务器错误')
    error.status = 500
    return next(error)
  }
})

//@desc orderTour
//@route Post /orders
export const orderTour = asyncHandler(async (req, res, next) => {
  const { userId, toursId, title, number } = req.body
  if (!userId || !toursId || !title || !number) {
    const error = new Error('未获得所需数据')
    error.status = 400
    return next(error)
  }
  const checkUid = await Users.findOne({ userId: userId })
  if (!checkUid) {
    const error = new Error('未找到此用户')
    error.status = 400
    return next(error)
  }
  const tourData = await Tours.findOne({ exclusiveID: toursId })
  if (!tourData) {
    const error = new Error('未找到旅游团')
    error.status = 400
    return next(error)
  }

  try {
    const orderData = await Orders.create({
      name: tourData.name,
      description: tourData.description,
      image: tourData.image,
      userId, 
      exclusiveID: toursId,
      title,
      number,
      time: new Date()
    })
  
    res.status(201).json({
      message: '订单创建成功',
      data: {
        orderID: orderData.orderID,
        userId: orderData.userId,
        exclusiveID: orderData.exclusiveID
      }
    })
  } catch (err) {
    console.log(err)
    const error = new Error('服务器错误')
    error.status = 500
    return next(error)
  }
})

//@desc delOrder
//@route Delete /orders
export const delOrder = asyncHandler(async (req, res, next) => {
  const { orderID, userId } = req.query
  if (!orderID || !userId) {
    const error = new Error('未获得所需数据')
    error.status = 400
    return next(error)
  }

  try {
    const order = await Orders.deleteOne({ 
      userId: userId,
      orderID: orderID 
    })
    if (order.deletedCount === 0) {
      const error = new Error('未找到此订单')
      error.status = 400
      return next(error)
    }
  
    res.status(200).json({
      msg: '删除成功'
    })

  } catch (err) {
    console.log(err)
    const error = new Error('服务器错误')
    error.status = 500
    return next(error)
  }
})