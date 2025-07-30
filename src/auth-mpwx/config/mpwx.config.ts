import { registerAs } from '@nestjs/config';

import { IsOptional, IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { MpwxConfig } from './mpwx-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  MPWX_APPID: string;

  @IsString()
  @IsOptional()
  MPWX_SECRET: string;
}

export default registerAs<MpwxConfig>('mpwx', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    appid: process.env.MPWX_APPID,
    secret: process.env.MPWX_SECRET,
  };
});
