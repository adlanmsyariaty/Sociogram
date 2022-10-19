import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { PostSchema } from './post.model';
import { PostController } from './posts.controller';

export type Post = {
  imageUrl: string;
  caption: string;
};

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Post',
        schema: PostSchema
      },
    ]),
  ],
  controllers: [PostController],
  providers: [PostsService],
})
export class PostsModule {}
