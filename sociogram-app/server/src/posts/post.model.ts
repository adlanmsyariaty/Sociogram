import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema({
  imageUrl: { type: String },
  caption: { type: String },
});

export interface Post {
  imageUrl: string;
  caption: string;
}
