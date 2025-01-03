import mongoose from 'mongoose';

const Coment = new mongoose.Schema({
  name:{
    type: String,
  },
  surname:{
    type: String,
  },
  image: {
    type: String,
  },
  comments: { type: String },
  userID: {
    type: String,
    required: true,
  },
  isActive: Boolean,
});

export default mongoose.model('Coment', Coment);
