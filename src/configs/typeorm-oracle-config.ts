import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
const connectStringMDM = process.env.CONNECT_STRING_MDM;
const connectStringPortalSi = process.env.CONNECT_STRING_PORTALSI;
const connectStringPeo = process.env.CONNECT_STRING_PEO;
const username = process.env.IMS_DB_USERNAME;
const password = process.env.IMS_DB_PASSWORD;
const peoUsername = process.env.PEO_DB_USERNAME;
const peoPw = process.env.PEO_DB_PASSWORD;
export const pelindoMDMOption: TypeOrmModuleOptions = {
  name: 'pelindo_mdm',
  type: 'oracle',
  username,
  password,
  extra: {
    connectString: connectStringMDM,
  },
} as TypeOrmModuleOptions;

export const pelindoPortalsi: TypeOrmModuleOptions = {
  name: 'pelindo_portalsi',
  type: 'oracle',
  username,
  password,
  extra: {
    connectString: connectStringPortalSi,
  },
} as TypeOrmModuleOptions;

// export const pelindoPEOOption: TypeOrmModuleOptions = {
//   name: 'pelindo_peo',
//   type: 'oracle',
//   username: peoUsername,
//   password: peoPw,
//   extra: {
//     connectString: connectStringPeo,
//   },
// } as TypeOrmModuleOptions;

export const pelindoPEOOption: TypeOrmModuleOptions = {
  name: 'pelindo_peo',
  type: 'oracle',
  host: '10.122.1.187', // Database host
  port: 1521,
  username: peoUsername,
  password: peoPw,
  sid: 'madra_salya.sub11240637381.proddb01.oraclevcn.com',
} as TypeOrmModuleOptions;
