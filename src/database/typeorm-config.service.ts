import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Department } from 'src/department/entities/department.entity';
import { Job } from 'src/job/entities/job.entity';
import { DepartmentMvEntity } from 'src/peo-department/entities/department.mv.entity';
import { RoleMvEntity } from 'src/peo-role/entity/role.mv.entity';
import { RolePeoEntity } from 'src/peo-role/entity/role.peo.entity';
import { PrivilegeMvEntity } from 'src/peo-user/entities/privilage.mv.entity';
import { UserMvEntity } from 'src/peo-user/entities/user.mv.entity';
import { Privilege } from 'src/privilage/entities/privilage.entity';
import { RoleSystem } from 'src/role/entities/role-system.entity';
import { Role } from 'src/role/entities/role.entity';
import { SyncFailedLog } from 'src/sync-log/entities/sync-failed-log.entity';
import { SyncLog } from 'src/sync-log/entities/sync-log.entity';
import { User } from 'src/users/entities/user.entity';
import { DivisiPeoEntity } from '../peo-department/entities/divisi.peo.entity';
import { DivisiMvEntity } from '../peo-upload/entities/divisi.mv.entity';
import { AtasanBawahanMvEntity } from '../peo-upload/entities/atasan-bawahan.mv.entity';
import { RolePegawaiMvEntity } from '../peo-upload/entities/role-pegawai.mv.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get('database.type'),
      // url: this.configService.get('database.url'),
      host: this.configService.get('database.host'),
      port: this.configService.get('database.port'),
      username: this.configService.get('database.username'),
      password: this.configService.get('database.password'),
      database: this.configService.get('database.name'),
      synchronize: this.configService.get('database.synchronize'),
      dropSchema: false,
      keepConnectionAlive: true,
      logging: this.configService.get('app.nodeEnv') !== 'production',
      entities: [
        Role,
        User,
        Department,
        Job,
        SyncFailedLog,
        SyncLog,
        Privilege,
        RoleSystem,
        RolePeoEntity,
        RoleMvEntity,
        UserMvEntity,
        DepartmentMvEntity,
        PrivilegeMvEntity,
        DivisiPeoEntity,
        DivisiMvEntity,
        AtasanBawahanMvEntity,
        RolePegawaiMvEntity,
      ],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'subscriber',
      },
      extra: {
        // based on https://node-postgres.com/apis/pool
        // max connection pool size
        max: this.configService.get('database.maxConnections'),
        ssl: this.configService.get('database.sslEnabled')
          ? {
              rejectUnauthorized: this.configService.get(
                'database.rejectUnauthorized',
              ),
              ca: this.configService.get('database.ca') ?? undefined,
              key: this.configService.get('database.key') ?? undefined,
              cert: this.configService.get('database.cert') ?? undefined,
            }
          : undefined,
      },
    } as TypeOrmModuleOptions;
  }
}
