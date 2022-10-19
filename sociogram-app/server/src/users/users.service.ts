import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.model';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private users: User[] = [];

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async signUp(
    name: string,
    username: string,
    email: string,
    password: string,
  ) {
    try {
      const isUserExist = await this.userModel.findOne({ email: email })
      if (isUserExist) {
        throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST)
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new this.userModel({
        name,
        email,
        username,
        password: hashedPassword,
      });

      const data = await newUser.save();
      let result = {
        name: data.name,
        email: data.email,
        username: data.username
      }

      return {
        status: 201,
        data: result
      };
    } catch (error) {
      if (error.response == 'Bad Request') {
        throw new HttpException('Email already registered', HttpStatus.BAD_REQUEST)
      } else if (error._message = 'User validation failed') {
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

  async login(
    email: string,
    password: string,
  ) {
    try {
      if (!email) throw new HttpException('Email Required', HttpStatus.BAD_REQUEST)
      if (!password) throw new HttpException('Password Required', HttpStatus.BAD_REQUEST)

      const user = await this.userModel.findOne({ email: email })
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND)
      }

    } catch (error) {
      if (error.response == 'Not Found') {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND)
      } else if (error.response == 'Email Required') {
        throw new HttpException('Email Required', HttpStatus.NOT_FOUND)
      } else if (error.response == 'Password Required') {
        throw new HttpException('Password Required', HttpStatus.NOT_FOUND)
      } else {
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }
}
