import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty()
  @IsNotEmpty()
  code: string | null;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  name: string | null;

  @ApiProperty()
  parent?: number | null;

  @ApiProperty()
  source: string | null;

  @ApiProperty()
  i_com_code: string | null;

  @ApiProperty()
  i_objid: string | null;

  @ApiProperty()
  i_parid: string | null;

  @ApiProperty()
  i_level_organisasi: number | null;

  @ApiProperty()
  i_bobot_organisasi: string | null;

  @ApiProperty()
  i_updated_at: Date;

  @ApiProperty()
  description: string | null;

  @ApiHideProperty()
  created_at: Date;

  @ApiHideProperty()
  updated_at: Date;
}
