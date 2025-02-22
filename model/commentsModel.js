import mongoose from 'mongoose'

const commentSchema = mongoose.Schema({
  userId: {
    type: String, 
    required: true
  },
  exclusiveID: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { versionKey: false, timestamps: true });

export default mongoose.model('comments', commentSchema, 'comments');