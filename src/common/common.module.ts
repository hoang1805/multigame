import { Global, Module } from '@nestjs/common';
import { ApiAuthGuard } from './guards/api.auth.guard';
import { AuthModule } from 'src/auth/auth.module';
import { WsAuthGuard } from './guards/ws.auth.guard';
import { AuthGuard } from './guards/auth.guard';

@Global()
@Module({
  imports: [AuthModule],
  providers: [ApiAuthGuard, WsAuthGuard, AuthGuard],
  exports: [ApiAuthGuard, WsAuthGuard, AuthGuard],
})
export class CommonModule {}
