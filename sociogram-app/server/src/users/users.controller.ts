import { Controller, Post, Body } from '@nestjs/common';
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
    return res
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
    return res
  }
}
