import { Controller, Get, Render, Res } from '@nestjs/common';
import express from 'express';

@Controller()
export class AuthViewController {
  @Get('login')
  @Render('login')
  renderLogin(@Res() res: express.Response) {
    return { layout: 'layouts/auth', title: 'Login account' };
  }

  @Get('register')
  @Render('register')
  renderRegister(@Res() res: express.Response) {
    return { layout: 'layouts/auth', title: 'Register new account' };
  }
}
