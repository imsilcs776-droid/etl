import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateJobDto {
  @ApiProperty()
  @IsNotEmpty()
  code: string | null;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  name: string | null;

  @ApiProperty()
  description: string | null;

  @ApiProperty()
  source: string | null;

  @ApiProperty()
  i_com_code: string | null;

  @ApiProperty()
  i_objid: string | null;

  @ApiProperty()
  i_parid: string | null;

  @ApiHideProperty()
  created_at: Date;

  @ApiHideProperty()
  updated_at: Date;
}
