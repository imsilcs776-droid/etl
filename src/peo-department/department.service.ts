// import { Injectable } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { InjectRepository } from '@nestjs/typeorm';
// import { IsNull, Not, Repository } from 'typeorm';
// import { Department } from './entities/department.entity';
// import { delay } from 'src/utils/delay';
// import { CreateDepartmentDto } from './dto/create-department.dto';
// import { SyncLogsService } from 'src/sync-log/sync-log.service';
// import { DepartmentMDMService } from './department-mdm.service';
// import { DepartmentMvEntity } from './entities/department.mv.entity';
// import { DivisiPeoEntity } from './entities/divisi.peo.entity';

// @Injectable()
// export class DepartmentsService {
//   private axiosOptions = {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     json: true,
//     auth: {
//       username: 'admin',
//       password: '1234',
//     },
//     method: 'post',
//     url: '',
//     data: {},
//   };
//   constructor(
//     @InjectRepository(DepartmentMvEntity)
//     private repositoryDepartmentMv: Repository<DepartmentMvEntity>,
//     @InjectRepository(DivisiPeoEntity)
//     private repositoryDivisiPeo: Repository<DivisiPeoEntity>,
//     private syncLogService: SyncLogsService,
//     private departmentMDMService: DepartmentMDMService,
//     private readonly httpService: HttpService,
//   ) {}

//   // async processDepartment() {
//   //   const comCodes = [1000, 1310, 1320, 1330, 1340];
//   //   let index = 0;
//   //   while (comCodes[index]) {
//   //     await this.getDepartment(comCodes[index]);
//   //     index++;
//   //   }

//   //   const processedDepartment = await this.repository.count({
//   //     where: { source: 'IMS_INTEGRATION' },
//   //   });
//   //   const syncData = await this.syncLogService.addLog({
//   //     code: await this.repository.metadata.tableName.toString(),
//   //     updated_at: new Date(),
//   //   });
//   //   return { syncData, total: processedDepartment };
//   // }

//   public async processDepartment() {
//     const limit = 100;
//     let stop = false;
//     let page = 1;

//     while (!stop) {
//       await delay(500);
//       const departments = await this.getDepartments({
//         page,
//         limit,
//       });
//       if (departments && departments.length) {
//         await this.bulkInsert(departments);
//       } else {
//         stop = true;
//       }
//       page++;
//     }

//     const processedDepartment = await this.repository.count({
//       where: { source: 'IMS_INTEGRATION' },
//     });
//     const syncData = await this.syncLogService.addLog({
//       code: await this.repository.metadata.tableName.toString(),
//       updated_at: new Date(),
//     });
//     return { syncData, total: processedDepartment };
//   }

//   private async create(createDepartmentDto: CreateDepartmentDto) {
//     try {
//       return await this.repository.upsert(createDepartmentDto, ['i_objid']);
//     } catch (e) {
//       const { detail, code } = e || {};
//       return await this.syncLogService.addFailedLog({
//         entity: await this.repository.metadata.tableName.toString(),
//         reason: detail || code,
//         created_at: new Date(),
//         updated_at: new Date(),
//       });
//     }
//   }

//   private async bulkInsert(departments = []) {
//     let count = 0;

//     while (count < departments.length) {
//       const {
//         OBJID,
//         PARID,
//         CREATED_DATE,
//         LAST_UPDATED_DATE,
//         COMPANY_CODE,
//         STEXT,
//         LEVELORGANISASI,
//         DESCBOBOTORGANISASI,
//         KODEUNITKERJA,
//         PERSA,
//         WERKS_NEW,
//         ENDDA,
//       } = departments[count];

//       const body = new Department();
//       body.code = KODEUNITKERJA || '-';
//       body.name = STEXT;
//       body.is_active = true;
//       body.updated_at = new Date();
//       body.deleted_at = null;
//       body.i_updated_at = new Date(LAST_UPDATED_DATE);
//       body.created_at = new Date(CREATED_DATE);
//       body.source = 'IMS_INTEGRATION';
//       body.i_com_code = WERKS_NEW;
//       body.i_objid = OBJID;
//       body.i_parid = PARID;
//       body.i_bobot_organisasi = DESCBOBOTORGANISASI;
//       body.i_level_organisasi = LEVELORGANISASI;
//       body.description = STEXT;
//       body.i_endda = ENDDA;

//       await this.create(body);
//       count++;
//     }

//     return true;
//   }

//   /**
//    * get department
//    * @param {
//    *  page, limit, objid
//    * }
//    * @returns [OBJID,PARID,CREATED_DATE,LAST_UPDATED_DATE,COMPANY_CODE,STEXT,PERSA,WERKS_NEW]
//    */
//   private async getDepartments({ page, limit }): Promise<any> {
//     return await this.departmentMDMService.getDepartment({ page, limit });
//   }

//   public async setDepartments({ objid }): Promise<any> {
//     const departments: any[] = await this.departmentMDMService.getDepartment({
//       objid,
//     });
//     await this.bulkInsert(departments);
//     const [department] = departments;
//     const local = await this.repository.findOneBy({
//       i_objid: department.OBJID,
//     });
//     return {
//       local,
//       department,
//     };
//   }
// }
