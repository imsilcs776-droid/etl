import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class BaseDTO {
  @ApiHideProperty()
  public createdBy: number;

  @ApiHideProperty()
  public createdAt: Date;

  @ApiHideProperty()
  public updatedAt: Date;

  @ApiHideProperty()
  public deletedAt: Date;
}
