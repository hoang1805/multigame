import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user';
import { AuthModule } from 'src/auth/auth.module';
import { UserViewController } from './user.view.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  controllers: [UserController, UserViewController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
