import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesMvEntity } from './entities/companies.mv.entity';
import { CompanyMvService } from './mv-company.service';
import { CompanyMvController } from './mv-company.controller';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([CompaniesMvEntity]),
    ],
    controllers: [CompanyMvController],
    providers: [CompanyMvService],
    exports: [CompanyMvService, TypeOrmModule.forFeature([CompaniesMvEntity])],
})
export class CompanyMvModule { }
