import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import express from 'express';
import * as appRequest from 'src/common/interfaces/app.request';
import { CaroService } from 'src/caro/services/caro.service';
import { Line98Service } from 'src/line98/line98.service';
import { UserService } from 'src/user/user.service';

@Controller('history')
@UseGuards(AuthGuard)
export class HistoryController {
  constructor(
    private readonly caroService: CaroService,
    private readonly line98Service: Line98Service,
    private readonly userService: UserService,
  ) {}
  @Get('caro')
  async renderCaroHistory(
    @Req() request: appRequest.AppRequest,
    @Res() response: express.Response,
    @Query('page') page: number,
  ) {
    const userId = request.__context?.sub;
    if (!userId || isNaN(userId)) {
      return response.redirect('/home');
    }

    if (isNaN(page) || page <= 0) {
      page = 1;
    }

    const size = 10;
    const caros = await this.caroService.paginate(userId, {
      size,
      page,
    });
    const users = await this.userService.getAll();

    return response.render('history/caro', {
      layout: 'layouts/main',
      users,
      userId,
      caroList: caros,
    });
  }

  @Get('line98')
  async renderLine98History(
    @Req() request: appRequest.AppRequest,
    @Res() response: express.Response,
    @Query('page') page: number,
  ) {
    const userId = request.__context?.sub;
    if (!userId || isNaN(userId)) {
      return response.redirect('/home');
    }

    if (isNaN(page) || page <= 0) {
      page = 1;
    }

    const size = 10;
    const line98s = await this.line98Service.paginate(userId, {
      size,
      page,
    });

    return response.render('history/line98', {
      layout: 'layouts/main',
      userId,
      line98List: line98s,
    });
  }
}
