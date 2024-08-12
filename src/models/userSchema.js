import mongoose from 'mongoose';

const User = new mongoose.Schema({
 
  email: {
    type: String,
    required: true,
    unique: true,
  },
  
  password: {
    type: String,
    required: true,
  },
  isActive: Boolean,
});

export default mongoose.model('Users', User);
