import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSyncLogDto {
  @ApiProperty()
  @IsNotEmpty()
  code: string | null;

  @ApiHideProperty()
  created_at?: Date;

  @ApiHideProperty()
  updated_at?: Date;
}
