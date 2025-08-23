import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import express from 'express';
import { UserService } from './user.service';
import { UserResponseDto } from './dtos/user.response.dto';
import * as appRequest from 'src/common/interfaces/app.request';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('user')
@UseGuards(AuthGuard)
export class UserViewController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async renderMe(
    @Req() request: appRequest.AppRequest,
    @Res() response: express.Response,
  ) {
    const userId = request.__context?.sub;

    if (!userId) {
      response.redirect('/home');
      return;
    }

    const user = await this.userService.getById(userId);

    if (!user) {
      response.redirect('/home');
      return;
    }

    const exportData: UserResponseDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      nickname: user.nickname,
      createdAt: user.createdAt,
    };

    return response.render('me', {
      layout: 'layouts/main',
      title: 'User information',
      ...exportData,
    });
  }

  @Get()
  redirect(@Res() response: express.Response) {
    response.redirect('/user/me');
  }
}
