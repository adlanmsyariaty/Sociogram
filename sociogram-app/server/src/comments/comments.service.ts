import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './comment.model';
import { Post } from '../posts/post.model';
import { Model } from 'mongoose';

@Injectable()
export class CommentsService {
  private comments: Comment[] = [];
  private posts: Post[] = [];

  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
    @InjectModel('Post') private readonly postModel: Model<Post>
    ) {}

  async addComment(
    userId: string,
    postId: string,
    message: string,
    username: string,
  ) {
    try {
      const newComment = new this.commentModel({
        userId,
        message,
      });

      const addedComment = await newComment.save()

      const postData = await this.postModel.findOne({ _id: postId })

      if (!postData) throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
      const updatedPost = await this.postModel.updateOne(
        { _id: postId },
        { $push: { comments: addedComment._id } }
      )

      let result: any = {
        ...addedComment,
      }
      result.userId = {
        _id: String(result.userId),
        username: username
      }

      return {
        result: result
      };
    } catch (error) {
      if (error.response == 'Post not found') {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
      } else {
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }
}
