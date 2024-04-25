import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import databaseConfig from './configs/database.config';
import {
  pelindoMDMOption,
  pelindoPEOOption,
  pelindoPortalsi,
} from './configs/typeorm-oracle-config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DepartmentsModule } from './department/department.module';
import { JobsModule } from './job/job.module';
// import { PrivilegesModule } from './privilage/privilage.module';
import { RolesModule } from './role/role.module';
import { ImsModule } from './ims/ims.module';
import { UsersModule } from './peo-user/users.module';
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
    // TypeOrmModule.forRoot(pelindoPEOOption),
    // TypeOrmModule.forRoot(pelindoPortalsi),
    UsersModule,
    // DepartmentsModule,
    // JobsModule,
    // RolesModule,
    // PrivilegesModule,
    ImsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
