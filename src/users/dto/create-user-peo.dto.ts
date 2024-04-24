import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateAccountPeoDto {
  @ApiProperty({ example: ['uuid1', 'uuid2'] })
  @IsNotEmpty()
  nipps: string[];
}
