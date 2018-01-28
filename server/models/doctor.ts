import * as mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: String,
  gender: String,
  languages:[String],
  telephone: String,
  address: {
    location: {
      lat: Number,
      lng: Number,
    },
    formatted: String
  }
});

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
