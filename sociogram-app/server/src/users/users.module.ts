import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UserSchema } from './user.model';
import { UserController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

export type User = {
  name: string;
  email: string;
  username: string;
  password: string;
};

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_KEY,
    }),
    MongooseModule.forFeatureAsync([
      {
        name: 'User',
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', function () {
            this.password = bcrypt.hashSync(this.password, 10);
          });
          return schema;
        }
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UsersService],
})
export class UsersModule {}
