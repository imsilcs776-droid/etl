import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateSyncFailedLogDto {
  @ApiProperty()
  entity: string;

  @ApiProperty()
  reason: string;

  @ApiHideProperty()
  created_at?: Date;

  @ApiHideProperty()
  updated_at?: Date;
}
