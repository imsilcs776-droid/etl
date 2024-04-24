import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({ example: 'test1@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  first_name: string | null;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  last_name: string | null;

  @ApiProperty()
  @IsNotEmpty()
  department: number | null;

  @ApiProperty()
  @IsNotEmpty()
  job: number | null;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  full_name: string | null;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty()
  nip: string | null;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty()
  nip_new: string | null;

  @ApiProperty({ example: '12345354' })
  @IsNotEmpty()
  i_department_code: string | null;

  @ApiProperty({ example: '12345354' })
  @IsNotEmpty()
  i_com_code: string | null;

  @ApiProperty({ example: '12345354' })
  @IsNotEmpty()
  i_werk: string | null;

  @ApiProperty({ example: '12345354' })
  @IsNotEmpty()
  i_id: string | null;
}
