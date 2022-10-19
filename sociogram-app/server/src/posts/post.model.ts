import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  imageUrl: { type: String, required: [true, 'Please choose image file'] },
  caption: { type: String, required: [true, 'Please enter caption field'] },
});

export interface Post {
  userId: string,
  imageUrl: string;
  caption: string;
}
