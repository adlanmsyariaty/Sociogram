import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please enter name field'] },
  email: {
    type: String,
    required: [true, 'Please enter email field'],
    unique: true,
    dropDups: true,
  },
  username: { type: String, required: [true, 'Please enter username field'] },
  password: { type: String, required: [true, 'Please enter password field'] },
});

export interface User {
  name: string;
  email: string;
  username: string;
  password: string;
}
