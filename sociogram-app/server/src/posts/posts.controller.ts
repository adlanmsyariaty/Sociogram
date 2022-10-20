import { Controller, Post, Get, Body, HttpException, HttpStatus, Request, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async viewPost() {
    const res = await this.postsService.getPost()

    throw new HttpException({
      statusCode: HttpStatus.OK,
      data: res
    }, HttpStatus.OK)
  }

  @UseGuards(AuthGuard)
  @Post('add')
  async createPost(
    @Body('imageUrl') imageUrl: string,
    @Body('caption') caption: string,
    @Request() req
  ) {
    const userId = req.user.id
    const res = await this.postsService.addPost(
      userId,
      imageUrl,
      caption,
    )

    throw new HttpException({
      statusCode: HttpStatus.CREATED,
      data: res.result
    }, HttpStatus.CREATED)
  }

  @UseGuards(AuthGuard)
  @Post('imageUpload')
  @UseInterceptors(FileInterceptor('image'))
  async imageUpload(
    @UploadedFile() imageFile,
  ) {
    const res = await this.postsService.upload(imageFile)
    throw new HttpException({
      statusCode: HttpStatus.CREATED,
      data: res
    }, HttpStatus.CREATED)
  }
}
