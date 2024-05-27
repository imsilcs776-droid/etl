import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, IsNull, Not, Repository } from 'typeorm';
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

  public async processUserDepartment({ nippNew = '' }) {
    const limit = 100;
    let stop = false;
    let page = 1;

    while (!stop) {
      await delay(500);
      const { data } = await this.getPeoPegawai({
        nippNew,
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
      const { nipp_baru, kd_div_arsip, kd_wil_arsip } = users[count];

      const dept = await this.repositoryDepartmentMv.findOne({
        select: ['id'],
        where: {
          code: kd_div_arsip,
          i_kd_wil: kd_wil_arsip,
        },
        order: {
          i_endda: 'DESC',
        },
      });

      if (dept) {
        await this.repositoryUserMv.update(
          { nip_new: nipp_baru },
          { department: dept.id },
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
  private async getPeoPegawai({ page, limit, nippNew = '' }): Promise<any> {
    if (nippNew) {
      const [data, total] = await this.repositoryRolePegawaiPeo.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          nipp: Not(IsNull()),
          pegawai: 'SPTP',
          nipp_baru: nippNew,
        },
        order: {
          nipp_baru: 'ASC',
        },
      });
      return { data, total };
    }

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
