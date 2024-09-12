import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import databaseConfig from './configs/database.config';
import {
  pelindoPEOOption,
  pelindoPortalsiOption,
} from './configs/typeorm-oracle-config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { PrivilegesModule } from './privilage/privilage.module';
import { RolesModule } from './role/role.module';
import { ImsModule } from './ims/ims.module';
import { UsersModule } from './peo-user/users.module';
import { PeoDepartmentsModule } from './peo-department/department.module';
import { PeoUploadModule } from './peo-upload/peo-upload.module';
import { SinkAtasanBawahanModule } from './sink-atasan-bawahan/atasan-bawahan.module';
import { SinkDivisiModule } from './sink-divisi/divisi.module';
import { SinkPegawaiModule } from './sink-pegawai/pegawai.module';
import { PeoTestService } from './peo-test/peo-test.service';
import { PeoTestController } from './peo-test/peo-test.controller';
import { SinkPlhModule } from './sink-plh/plh.module';
dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    // TypeOrmModule.forRoot(pelindoMDMOption),
    TypeOrmModule.forRoot(pelindoPEOOption),
    TypeOrmModule.forRoot(pelindoPortalsiOption),
    UsersModule,
    // DepartmentsModule,
    // JobsModule,
    RolesModule,
    PrivilegesModule,
    ImsModule,
    PeoDepartmentsModule,
    PeoUploadModule,

    /**
     * sink modules using pelindoPEOOption
     */
    SinkAtasanBawahanModule,
    SinkDivisiModule,
    SinkPegawaiModule,
    SinkPlhModule,
  ],
  // controllers: [],
  controllers: [AppController, PeoTestController],
  providers: [PeoTestService],
})
export class AppModule {}
