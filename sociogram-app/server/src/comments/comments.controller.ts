import { Controller, Post, Body, HttpException, HttpStatus, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard)
  @Post('add')
  async createComment(
    @Body('message') message: string,
    @Body('postId') postId: string,
    @Request() req
  ) {
    const userId = req.user.id
    const username = req.user.username
    const res = await this.commentsService.addComment(
      userId,
      postId,
      message,
      username
    )

    throw new HttpException({
      statusCode: HttpStatus.CREATED,
      data: res.result,
    }, HttpStatus.CREATED)
  }
}
