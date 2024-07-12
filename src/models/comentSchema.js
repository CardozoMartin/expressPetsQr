import mongoose from 'mongoose';

const Coment = new mongoose.Schema({
  comments: { type: String },
  image: {
    type: String,
  },
  userName:{
    type: String,
  },
  userID: {
    type: String,
    required: true,
  },
  isActive: Boolean,
});

export default mongoose.model('Coment', Coment);
