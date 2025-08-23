import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './models/session';
import { UserModule } from 'src/user/user.module';
import { AuthViewController } from './auth.view.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Session]), forwardRef(() => UserModule)],
  controllers: [AuthController, AuthViewController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
