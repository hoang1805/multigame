import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as appRequest from 'src/common/interfaces/app.request';
import express from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Line98Service } from './line98.service';

@UseGuards(AuthGuard)
@Controller('line98')
export class Line98ViewController {
  constructor(private readonly line98Service: Line98Service) {}
  @Get(':id')
  async getGame(
    @Req() request: appRequest.AppRequest,
    @Res() response: express.Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = request.__context?.sub;
    if (!userId) {
      response.redirect('/home');
      return;
    }

    const game = await this.line98Service.getGame(id);
    if (!game || game.isFinished) {
      response.redirect('/home');
      return;
    }
    const { config, state, score } = game;
    this.line98Service.setGameCache(userId, game.id);
    console.log(this.line98Service.getGameCache(userId));

    return response.render('line98', {
      layout: 'layouts/main',
      config,
      state,
      score,
      matchId: game.id,
    });
  }
}
