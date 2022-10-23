import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './post.model';
import { Model } from 'mongoose';

const mkdirp = require('mkdirp')
const fs = require('fs')
let AWS = require('aws-sdk')

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
      const posts = await this.postModel.find()
        .populate({
          path: 'comments',
          populate: {
            path: 'userId',
            model: 'User',
            select: '_id name username'
          }
        })
        .populate('userId', '_id name username').sort({'createdAt': -1})

      return posts
    } catch (error) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async upload(
    imageFile: any
  ) {
    try {
      mkdirp.sync('data/images')
      let directory = 'data/images/' + imageFile.originalname

      let bitmap = new Buffer(imageFile.buffer.toString('base64').replace(/^data:image\/w+;base64,/, ""), 'base64')
      fs.writeFileSync(directory, bitmap)

      AWS.config.update({
        region: 'ap-southeast-1',
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
      })

      let s3Param = {
        params: {
          Bucket: process.env.BUCKET_NAME,
          ContentType: 'image/jpeg',
          ACL: 'public-read',
          Metadata: {
            'Cache-Control': 'max-age=' + (365 * 24 * 3600)
          },
          CacheControl: 'max-age=' + (365 * 24 * 3600)
        }
      }

      let s3obj = new AWS.S3(s3Param)
      let imageData = fs.readFileSync(directory)
      let data = await s3obj
        .upload({
          Key: 'sociogramimage/IMG_' + new Date().getTime() + '.jpeg',
          Body: imageData
        })
        .promise()

      fs.unlinkSync(directory)

      data = {
        imageUrl: data.Location
      }
      return data
    } catch (error) {
      console.log(error)
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
