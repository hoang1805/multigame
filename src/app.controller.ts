import {
  Controller,
  Get,
  Redirect,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import express from 'express';
import { AuthGuard } from './common/guards/auth.guard';
import type { AppRequest } from './common/interfaces/app.request';
import type { Response } from 'express';
import { UserService } from './user/user.service';

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Redirect('/home', 302)
  root() {
    return;
  }

  @UseGuards(AuthGuard)
  @Get('home')
  async renderHome(@Req() request: AppRequest, @Res() response: Response) {
    const userId = request.__context?.sub;

    if (!userId) {
      response.redirect('/login');
      return;
    }

    const user = await this.userService.getById(userId);

    if (!user) {
      response.redirect('/login');
      return;
    }

    return response.render('home', {
      layout: 'layouts/main',
      nickname: user.nickname,
    });
  }
}
