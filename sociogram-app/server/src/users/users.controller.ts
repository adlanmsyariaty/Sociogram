import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async register(
    @Body('name') name: string,
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const res = await this.usersService.signUp(
      name,
      username,
      email,
      password
    )

    throw new HttpException({
      statusCode: HttpStatus.CREATED,
      data: res.result
    }, HttpStatus.CREATED)
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const res = await this.usersService.login(
      email,
      password
    )

    throw new HttpException({
      statusCode: HttpStatus.OK,
      data: {
        access_token: res.access_token
      }
    }, HttpStatus.OK)
  }
}
