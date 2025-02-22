import mongoose from 'mongoose';
import Counter from './counterModel.js';

// 定义用户Schema
const userSchema = mongoose.Schema({
  userId: {
    type: String,
    unique: true
  },
  username: {
    type: String,
    required: [true, "请输入用户名"],
    unique: [true, "用户名已被占用"],
  },
  password: {
    type: String,
    required: true, 
  }
}, { versionKey: false, timestamps: true }); // 禁用__v版本键，并启用时间戳

userSchema.pre('save', async function(next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { modelName: 'User' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.userId = counter.seq.toString();
  }
  next();
});

export default mongoose.model('users', userSchema, 'users');