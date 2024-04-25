import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreatePrivilegeDto {
  @ApiProperty()
  role: number;

  @ApiProperty()
  user: string | null;

  @ApiProperty()
  product: number | null;

  @ApiProperty()
  source: string | null;

  @ApiProperty()
  i_id: string | null;

  @ApiProperty()
  i_nip: string | null;

  @ApiProperty()
  i_role: string | null;

  @ApiHideProperty()
  created_at: Date;

  @ApiHideProperty()
  updated_at: Date;
}
