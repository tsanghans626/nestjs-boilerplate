import { Module } from '@nestjs/common';
import { AuthMpwxService } from './auth-mpwx.service';
import { ConfigModule } from '@nestjs/config';
import { AuthMpwxController } from './auth-mpwx.controller';
import { AuthModule } from '../auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, AuthModule, HttpModule],
  providers: [AuthMpwxService],
  exports: [AuthMpwxService],
  controllers: [AuthMpwxController],
})
export class AuthMpwxModule {}
