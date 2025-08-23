import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { CaroModule } from 'src/caro/caro.module';
import { Line98Module } from 'src/line98/line98.module';

@Module({
  imports: [AuthModule, UserModule, CaroModule, Line98Module],
  controllers: [HistoryController],
})
export class HistoryModule {}
