import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsService } from './comments.service';
import { CommentSchema } from './comment.model';
import { CommentController } from './comments.controller';
import { JwtModule } from '@nestjs/jwt';
import { PostSchema } from 'src/posts/post.model';
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
      {
        name: 'Comment',
        schema: CommentSchema
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_KEY,
    })
  ],
  controllers: [CommentController],
  providers: [CommentsService],
})
export class CommentsModule {}
