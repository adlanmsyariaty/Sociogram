import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { PostSchema } from './post.model';
import { PostController } from './posts.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { UserSchema } from 'src/users/user.model';

export type Post = {
  imageUrl: string;
  caption: string;
};

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema
      },
      {
        name: 'Post',
        schema: PostSchema
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_KEY,
    })
  ],
  controllers: [PostController],
  providers: [PostsService],
})
export class PostsModule {}
