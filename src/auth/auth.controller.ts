import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dtos/register.dto';
import express, { response } from 'express';
import { LoginDto } from './dtos/login.dto';
import { HashUtil } from 'src/common/utils/hash.util';
import * as appRequest from 'src/common/interfaces/app.request';
import { ApiAuthGuard } from 'src/common/guards/api.auth.guard';
import { HttpExceptionFilter } from 'src/common/filters/exception.filter';

@Controller('api/auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async registerAccount(
    @Body() data: RegisterDto,
    @Res() response: express.Response,
  ) {
    if (data.password != data.rePassword) {
      throw new BadRequestException(
        'Your password does not match. Please try again!!',
      );
    }

    await this.userService.createUser(
      data.username,
      data.password,
      data.email,
      data.nickname,
    );

    response
      .status(HttpStatus.OK)
      .json({ message: 'Register account successfully !!!' });
  }

  @Post('login')
  async login(@Body() data: LoginDto, @Res() response: express.Response) {
    const user = await this.userService.getByUsername(data.username);
    const notFound = new NotFoundException(
      'Invalid username or password. Please try again !!!',
    );

    if (!user) {
      throw notFound;
    }

    if (!(await HashUtil.compareBcrypt(data.password, user.password))) {
      throw notFound;
    }

    const clientToken = await this.authService.login(user.id, user.username);
    response.cookie('accessToken', clientToken.accessToken, {
      httpOnly: false,
      maxAge:
        parseDuration(process.env.ACCESS_TOKEN_EXPIRE ?? '30m') -
        parseDuration('5m'),
    });
    response.cookie('refreshToken', clientToken.refreshToken, {
      httpOnly: false,
      maxAge:
        parseDuration(process.env.REFRESH_TOKEN_EXPIRE ?? '30d') -
        parseDuration('5m'),
    });

    response.status(HttpStatus.OK).json({ message: 'successfull' });
  }

  @Get('refresh')
  async refreshAccessToken(
    @Query('refreshToken') token: string,
    @Res() response: express.Response,
  ) {
    const accessToken = await this.authService.refresh(token);
    response.cookie('accessToken', accessToken, {
      httpOnly: false,
      maxAge:
        parseDuration(process.env.ACCESS_TOKEN_EXPIRE ?? '30m') -
        parseDuration('5m'),
    });
    response.status(HttpStatus.OK);
  }

  @UseGuards(ApiAuthGuard)
  @Post('logout')
  async logout(
    @Req() request: appRequest.AppRequest,
    @Res() response: express.Response,
  ) {
    const context = request.__context;

    if (!context) {
      throw new UnauthorizedException();
    }

    await this.authService.revokeSession(context.sid);
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
    response.status(HttpStatus.OK).json({ message: 'Logout successfully !!!' });
  }
}

export function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error('Invalid duration format');

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error('Invalid duration unit');
  }
}
