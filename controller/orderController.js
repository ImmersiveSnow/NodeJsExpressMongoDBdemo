import asyncHandler from 'express-async-handler'
import Orders from '../model/ordersModel.js'
import Tours from '../model/toursModel.js'
import Users from '../model/usersModel.js'

//@desc getOrdersList
//@route Get /orders/page
export const getOrdersList = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page)
  const size = parseInt(req.query.size)
  const userId = req.query.uid
  if(!page || !size || !userId) {
    const error = new Error('未获得所需数据')
    error.status = 400
    return next(error)
  }

  try {
    const totalOrders = await Orders.countDocuments({ userId: userId });
    const skipPages = (page - 1) * size
    const totalPages = Math.ceil(totalOrders / size)
    let orders
    if (skipPages >= totalOrders) {
      orders = []
    } else {
      orders = await Orders.find({ userId: userId }).skip(skipPages).limit(size)
    }
    const data = orders.map(order => ({
      name: order.name,
      description: order.description,
      image: `http://localhost:3000/${order.image.replace(/\\/g, '/')}`,
      number: order.number,
      time: order.time,
      orderID: order.orderID,
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
//@route Put /orders
export const orderTour = asyncHandler(async (req, res, next) => {
  console.log(req.body)
  console.log(req.query)
  
  const { uid, toursId, title, number } = req.body
  if (!uid || !toursId || !title || !number) {
    const error = new Error('未获得所需数据')
    error.status = 400
    return next(error)
  }
  const checkUid = await Users.findOne({ userId: uid })
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
      userId: uid, 
      exclusiveID: toursId,
      title,
      number,
      time: new Date()
    })
  
    res.status(201).json({
      message: '订单创建成功',
      data: {
        orderID: orderData.orderID,
        uid: orderData.uid,
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
  const { orderID, uid } = req.body
  if (!orderID || !uid) {
    const error = new Error('未获得所需数据')
    error.status = 400
    return next(error)
  }

  try {
    const order = await Orders.deleteOne({ 
      userId: uid,
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