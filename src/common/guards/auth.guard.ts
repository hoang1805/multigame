import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { JwtTokenPayload } from 'src/auth/interfaces/jwt.token.payload';
import { AuthService } from 'src/auth/services/auth.service';
import { AppRequest } from '../interfaces/app.request';
import { Request, Response } from 'express';
import { parseDuration } from 'src/auth/auth.controller';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AppRequest>();
    const response = context.switchToHttp().getResponse<Response>();
    let refreshToken: string = '';
    let payload: JwtTokenPayload | null = null;

    try {
      const accessToken = this._getTokenFromCookies(request, 'accessToken');
      refreshToken = this._getTokenFromCookies(request, 'refreshToken');

      if (!refreshToken) {
        response.redirect('/login');
        return false;
      }

      if (!accessToken) {
        throw new TokenExpiredError('', new Date());
      }

      payload = await this.jwtService.verifyAsync<JwtTokenPayload>(
        accessToken,
        { secret: process.env.ACCESS_TOKEN_SECRET },
      );
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        const accessToken = await this._refreshToken(refreshToken);

        if (!accessToken) {
          response.redirect('/login');
          return false; // ⚠️ return false ngay sau redirect
        }

        // Chỉ gửi cookie nếu chưa redirect
        response.cookie('accessToken', accessToken, {
          httpOnly: false,
          maxAge:
            parseDuration(process.env.ACCESS_TOKEN_EXPIRE ?? '30m') -
            parseDuration('5m'),
        });

        // Verify token mới
        payload = await this.jwtService.verifyAsync<JwtTokenPayload>(
          accessToken,
          { secret: process.env.ACCESS_TOKEN_SECRET },
        );
      } else {
        response.redirect('/login');
        return false;
      }
    }

    if (!payload) {
      response.redirect('/login');
      return false;
    }

    request.__context = payload;
    return true;
  }

  private _getTokenFromCookies(request: Request, key: string) {
    const auth = request.cookies[key];
    if (!auth) {
      return '';
    }

    return auth as string;
  }

  private async _refreshToken(refreshToken: string): Promise<string | null> {
    try {
      const token = await this.authService.refresh(refreshToken);
      return token;
    } catch (_) {
      return null;
    }
  }
}
