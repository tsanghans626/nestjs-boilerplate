import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocialInterface } from '../social/interfaces/social.interface';
import { AuthMpwxLoginDto } from './dto/auth-mpwx-login.dto';
import { AllConfigType } from '../config/config.type';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthMpwxService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async getProfileByToken(
    loginDto: AuthMpwxLoginDto,
  ): Promise<SocialInterface> {
    const { data } = await lastValueFrom(
      this.httpService.get('https://api.weixin.qq.com/sns/jscode2session', {
        params: {
          appid: this.configService.getOrThrow('mpwx.appid', {
            infer: true,
          }),
          secret: this.configService.getOrThrow('mpwx.secret', {
            infer: true,
          }),
          js_code: loginDto.jsCode,
          grant_type: 'authorization_code',
        },
      }),
    );

    if (!data) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: 'Api 需要更换',
      });
    }

    if (data.errcode) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: `${data.errcode} ${data?.errmsg}`,
      });
    }

    return {
      id: data.openid,
    };
  }
}
