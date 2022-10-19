import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.model';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  private users: User[] = [];

  constructor(@InjectModel('User') private readonly userModel: Model<User>, private jwtService: JwtService) {}

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

      const newUser = new this.userModel({
        name,
        email,
        username,
        password,
      });

      const data = await newUser.save();
      let result = {
        name: data.name,
        email: data.email,
        username: data.username
      }

      return {
        result
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
      if (!email) throw new HttpException('Email is required', HttpStatus.BAD_REQUEST)
      if (!password) throw new HttpException('Password is required', HttpStatus.BAD_REQUEST)

      const user = await this.userModel.findOne({ email: email })
      if (!user) {
        throw new HttpException('User Not Found', HttpStatus.BAD_REQUEST)
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        throw new HttpException('Invalid', HttpStatus.NOT_FOUND)
      }

      const payload = {
        id: user._id,
        email: user.email
      }

      const access_token = this.jwtService.sign(payload)
      return {
        access_token
      };
    } catch (error) {
      if (error.response == 'User Not Found') {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND)
      } else if (error.response == 'Email is required') {
        throw new HttpException('Email is required', HttpStatus.BAD_REQUEST)
      } else if (error.response == 'Invalid') {
        throw new HttpException('Invalid email or password', HttpStatus.NOT_FOUND)
      } else if (error.response == 'Password is required') {
        throw new HttpException('Password is required', HttpStatus.BAD_REQUEST)
      } else {
        throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }
}
