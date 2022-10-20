import * as mongoose from 'mongoose';

export const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, default: '' },
  createdAt: { type: Number, default: Date.now }
});

export interface Comment {
  userId: string,
  message: string;
}
