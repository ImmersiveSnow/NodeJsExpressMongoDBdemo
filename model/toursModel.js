import mongoose from 'mongoose';
import Counter from './counterModel.js';

// 定义旅游Schema
const tourSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image :{
    type: String,
    required: true
  },
  exclusiveID: {
    type: String,
    unique: true
  },
}, { versionKey: false, timestamps: true });

tourSchema.pre('save', async function(next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { modelName: 'exclusiveID' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.exclusiveID = counter.seq.toString();
  }
  next();
});

export default mongoose.model('tours', tourSchema, 'tours');