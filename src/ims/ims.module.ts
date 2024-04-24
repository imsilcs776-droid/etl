import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { SyncLogsModule } from 'src/sync-log/sync-log.module';
import { Privilege } from 'src/privilage/entities/privilage.entity';
import { Role } from 'src/role/entities/role.entity';
import { ImsPrivilegeService } from './ims-privilege.service';
import { ImsController } from './ims.controller';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User, Privilege, Role]),
    SyncLogsModule,
  ],
  controllers: [ImsController],
  providers: [ImsPrivilegeService],
  exports: [ImsPrivilegeService],
})
export class ImsModule {}
