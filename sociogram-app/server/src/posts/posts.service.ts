import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './post.model';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  private posts: Post[] = [];

  constructor(@InjectModel('Post') private readonly postModel: Model<Post>) {}

  async addPost(
    userId: string,
    imageUrl: string,
    caption: string,
  ) {
    try {
      const newPost = new this.postModel({
        userId,
        imageUrl,
        caption,
      });

      const data = await newPost.save();

      return {
        result: data
      };
    } catch (error) {
      if (error._message = 'User validation failed') {
        let message = []
        Object.values(error.errors).forEach((el: any) => {
          message.push(el.properties.message)
        })
        throw new HttpException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: message
        }, HttpStatus.BAD_REQUEST)
      } else {
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  async getPost() {
    try {
      const posts = await this.postModel.find().populate('comments')

      return posts
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
