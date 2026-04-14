import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { ReqResLoginAdapter } from './adapter/reqres.adapter';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, ReqResLoginAdapter],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
