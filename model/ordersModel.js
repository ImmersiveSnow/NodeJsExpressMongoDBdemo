import mongoose from 'mongoose';
import Counter from './counterModel.js';

// 定义订单Schema
const orderSchema = mongoose.Schema({
  // 旅游团名称
  name: {
    type: String,
    required: true
  },
  // 旅游团描述
  description: {
    type: String,
    required: true
  },
  // 旅游团图片
  image: {
    type: String,
    required: true
  },
  // 订购团人数
  number: {
    type: Number,
    required: true
  },
  // 订单标题
  title: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  // 订单id
  orderID: {
    type: String,
    unique: true
  },
  // 旅游团id
  exclusiveID: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }

}, { versionKey: false, timestamps: true });

orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { modelName: 'Order' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.orderID = counter.seq.toString();
  }
  next();
});

export default mongoose.model('orders', orderSchema, 'orders');