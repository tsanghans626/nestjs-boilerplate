import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { AuthMpwxService } from './auth-mpwx.service';
import { AuthMpwxLoginDto } from './dto/auth-mpwx-login.dto';
import { LoginResponseDto } from '../auth/dto/login-response.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth/mpwx',
  version: '1',
})
export class AuthMpwxController {
  constructor(
    private readonly authService: AuthService,
    private readonly authMpwxService: AuthMpwxService,
  ) {}

  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: AuthMpwxLoginDto): Promise<LoginResponseDto> {
    const socialData = await this.authMpwxService.getProfileByToken(loginDto);

    return this.authService.validateSocialLogin('mpwx', socialData);
  }
}
