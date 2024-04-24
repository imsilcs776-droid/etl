import { Module } from '@nestjs/common';
import { PrivilegesService } from './privilage.service';
import { PrivilegesController } from './privilage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Privilege } from './entities/privilage.entity';
import { HttpModule } from '@nestjs/axios';
import { SyncLogsModule } from 'src/sync-log/sync-log.module';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { PrivilegesPEOService } from './privilage-peo.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Privilege, User, Role]),
    SyncLogsModule,
  ],
  controllers: [PrivilegesController],
  providers: [PrivilegesService, PrivilegesPEOService],
  exports: [PrivilegesService, PrivilegesPEOService],
})
export class PrivilegesModule {}
