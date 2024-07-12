import mongoose from 'mongoose';

const User = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  direccion: {
    type: String,
    require: true,
  },
  numberphone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: Boolean,
});

export default mongoose.model('Users', User);
