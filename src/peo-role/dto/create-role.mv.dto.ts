import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
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
  parent: number | null;

  @ApiProperty()
  i_id: string | null;

  @ApiProperty()
  i_parent: string | null;

  @ApiHideProperty()
  created_at: Date;

  @ApiHideProperty()
  updated_at: Date;
}
