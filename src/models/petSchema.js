import mongoose from 'mongoose';

const Pet = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  tipo: {
    type: String,
    require: true,
  },
  raza: {
    type: String,
    require: true,
  },
  direccion: { type: String, require: true },
  numberphone: { type: String, require: true },
  facebook: { type: String },
  instagram: { type: String },
  content: { type: String },
  image: {
    type: String,
  },
  userID: {
    type: String,
    required: true,
  },
  isActive: Boolean,
});

export default mongoose.model('Pets', Pet);
