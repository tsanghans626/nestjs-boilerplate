import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthMpwxLoginDto {
  @ApiProperty({ example: 'abc' })
  @IsNotEmpty()
  jsCode: string;
}
