import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
    }),
    UsersModule,
    PostsModule,
    CommentsModule,
    MongooseModule.forRoot(
      `mongodb+srv://mongo:${process.env.MONGO_PASS}@cluster0.ujxji.mongodb.net/sociogram?retryWrites=true&w=majority`,
    ),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
