import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { delay } from 'src/utils/delay';
import { UserMvEntity } from './entities/user.mv.entity';
import { RoleMvEntity } from 'src/peo-role/entity/role.mv.entity';
import { RolePeoEntity } from 'src/peo-role/entity/role.peo.entity';
import { DepartmentMvEntity } from 'src/peo-department/entities/department.mv.entity';

@Injectable()
export class UserDepartmentService {
  role: RoleMvEntity;
  constructor(
    @InjectRepository(UserMvEntity)
    private repositoryUserMv: Repository<UserMvEntity>,
    @InjectRepository(RolePeoEntity)
    private repositoryRolePegawaiPeo: Repository<RolePeoEntity>,
    @InjectRepository(DepartmentMvEntity)
    private repositoryDepartmentMv: Repository<DepartmentMvEntity>,
  ) {}

  public async processUserDepartment() {
    const limit = 100;
    let stop = false;
    let page = 1;

    while (!stop) {
      await delay(500);
      const { data } = await this.getPeoPegawai({
        page,
        limit,
      });
      if (data && data.length) {
        await this.bulkInsert(data);
      } else {
        stop = true;
      }
      page++;
    }

    const processedUser = await this.repositoryUserMv.count({
      where: { source: 'PEO' },
    });
    return { total: processedUser };
  }

  private async bulkInsert(users: RolePeoEntity[] = []) {
    let count = 0;

    while (count < users.length) {
      const { nipp_baru, kd_div_arsip } = users[count];

      const dept = await this.repositoryDepartmentMv.findOne({
        select: ['id'],
        where: {
          code: kd_div_arsip,
        },
      });

      if (dept) {
        await this.repositoryUserMv.update(
          { department: dept.id },
          { nip_new: nipp_baru },
        );
      }

      count++;
    }

    return true;
  }

  /**
   * get User
   * @param {
   *  page, limit, objid
   * }
   * @returns [OBJID,PARID,CREATED_DATE,LAST_UPDATED_DATE,COMPANY_CODE,STEXT,PERSA,WERKS_NEW]
   */
  private async getPeoPegawai({ page, limit }): Promise<any> {
    const [data, total] = await this.repositoryRolePegawaiPeo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        nipp: Not(IsNull()),
        nipp_baru: Not(IsNull()),
        pegawai: 'SPTP',
      },
      order: {
        nipp_baru: 'ASC',
      },
    });
    return { data, total };
  }
}
