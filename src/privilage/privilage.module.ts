import { Module } from '@nestjs/common';
import { PrivilegesService } from './privilage.service';
import { PrivilegesController } from './privilage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Privilege } from './entities/privilage.entity';
import { HttpModule } from '@nestjs/axios';
import { SyncLogsModule } from 'src/sync-log/sync-log.module';
import { Role } from 'src/role/entities/role.entity';
import { PrivilegesPortalsiService } from './privilage-portalsi.service';
import { UserMvEntity } from 'src/peo-user/entities/user.mv.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Privilege, UserMvEntity, Role]),
    SyncLogsModule,
  ],
  controllers: [PrivilegesController],
  providers: [PrivilegesService, PrivilegesPortalsiService],
  exports: [PrivilegesService, PrivilegesPortalsiService],
})
export class PrivilegesModule {}
