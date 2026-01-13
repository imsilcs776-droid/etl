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

  public async processUserDepartment({ nippNew = '' }) {
    const limit = 100;
    let stop = false;
    let page = 1;

    while (!stop) {
      await delay(500);
      const { data } = await this.getUserMv({
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

  private async bulkInsert(users: UserMvEntity[] = []) {
    let count = 0;

    while (count < users.length) {
      const { nip_new, i_kd_div, i_kd_wil } = users[count];

      console.log('dept', { nip_new, i_kd_div, i_kd_wil });

      const dept = await this.repositoryDepartmentMv.findOne({
        select: ['id'],
        where: {
          code: i_kd_div,
          i_kd_wil: i_kd_wil,
        },
        order: {
          i_endda: 'DESC',
        },
      });

      console.log('dept', dept);

      if (dept?.id) {
        await this.repositoryUserMv.update(
          { nip_new: nip_new },
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
  private async getUserMv({ page, limit, nippNew = '' }): Promise<any> {
    if (nippNew) {
      const [data, total] = await this.repositoryUserMv.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          nip: Not(IsNull()),
          nip_new: nippNew,
          is_active: true,
        },
        order: {
          nip_new: 'ASC',
        },
      });
      return { data, total };
    }

    const [data, total] = await this.repositoryUserMv.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        nip: Not(IsNull()),
        nip_new: Not(IsNull()),
        is_active: true,
      },
      order: {
        nip_new: 'ASC',
      },
    });
    return { data, total };
  }
}
