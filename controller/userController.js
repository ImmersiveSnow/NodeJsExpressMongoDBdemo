import { ObjectId } from 'mongodb'
import asyncHandler from 'express-async-handler'
import Users from '../model/usersModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

//@desc register 
//@route Post /users/register
export const register = asyncHandler(async (req, res, next) => {
  const { username, password } = req.query
  if (!username || !password) {
    const error = new Error('未获得所需数据')
    error.status = 400
    return next(error)
  }

  const checkOfUniqueness = await Users.findOne({ username })
  if (checkOfUniqueness) {
    const error = new Error('用户已被注册')
    error.status = 400
    return next(error)
  }

  // 混淆密码
  const hashPassword = await bcrypt.hash(password, 10)
  // console.log(`Hash password: ${hashPassword}`)

  // 创建新用户
  const userData = await Users.create({
    username,
    password: hashPassword
  })

  if (userData) {
    res.status(201).json({
      message: '注册成功', 
      uid: userData.userId, 
    })
  } else {
    const error = new Error('服务器错误')
    error.status = 500
    return next(error)
  }
})

//@desc login user
//@route Get /users/login
export const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.query
  if (!username || !password) {
    const error = new Error('未获得所需数据')
    error.status = 400
    return next(error)
  }

  const userData = await Users.findOne({ username })
  if (!userData) {
    const error = new Error('服务器错误')
    error.status = 500
    return next(error)
  }

  if (await bcrypt.compare(password, userData.password)) {
    const accessToken = jwt.sign({
      userData: {
        _id: userData._id.toString(),
        username: userData.username
      }
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m'})
    res.status(200).json({ 
      message: "登录成功",
      data: {
        uid: userData.userId,
        token: accessToken 
      }
    })
  } else {
    const error = new Error('用户名或密码错误')
    error.status = 401
    return next(error)
  }
})

//@desc current
//@route Get /users/currentUser
export const current = asyncHandler(async (req, res, next) => {
  try {
    const currentUser = await Users.findById(req.userData._id).select('-password');
    
    if (!currentUser) {
      const error = new Error('未找到该用户')
      error.status = 400
      return next(error)
    }
    
    // 返回当前用户的信息
    res.status(200).json({
      message: '获取当前用户成功',
      data: {
        uid: currentUser.userId,
        username: currentUser.username
      }
    })
  } catch (err) {
    // 如果发生错误，则抛出错误
    err.status = 500
    return next(err)
  }
})