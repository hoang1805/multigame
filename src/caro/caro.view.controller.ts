import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CaroService } from './services/caro.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import express from 'express';
import * as appRequest from 'src/common/interfaces/app.request';
import { UserService } from 'src/user/user.service';
import { title } from 'process';

@UseGuards(AuthGuard)
@Controller('caro')
export class CaroViewController {
  constructor(
    private readonly caroService: CaroService,
    private readonly userService: UserService,
  ) {}

  @Get(':id')
  async renderCaro(
    @Req() request: appRequest.AppRequest,
    @Res() response: express.Response,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = request.__context?.sub;
    if (!userId || isNaN(id)) {
      return response.redirect('/home');
    }

    try {
      const game = await this.caroService.getMatch(id);
      const state = game.state;
      const size = game.config.size;
      const players = game.state.players;
      const firstPlayer = players[0].symbol == 'X' ? players[0] : players[1];
      const secondPlayer = players[0].symbol == 'O' ? players[0] : players[1];

      const user = await this.userService.getById(
        players[0].id != userId ? players[0].id : players[1].id,
      );
      if (!user) throw new NotFoundException();

      const playerLeftName = firstPlayer.id == userId ? 'You' : user.nickname;
      const playerRightName = secondPlayer.id == userId ? 'You' : user.nickname;

      return response.render('caro', {
        layout: 'layouts/main',
        title: 'Play caro',
        matchId: id,
        state,
        size,
        playerLeftName,
        playerRightName,
      });
    } catch (_) {
      return response.redirect('/home');
    }
  }
}
