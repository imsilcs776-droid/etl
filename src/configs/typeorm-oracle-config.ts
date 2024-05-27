import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
const connectStringMDM = process.env.CONNECT_STRING_MDM;
const connectStringPeo = process.env.CONNECT_STRING_PEO;
const username = process.env.IMS_DB_USERNAME;
const password = process.env.IMS_DB_PASSWORD;

const usernamePeo = process.env.PEO_DB_USERNAME;
const passwordPeo = process.env.PEO_DB_PASSWORD;

export const pelindoMDMOption: TypeOrmModuleOptions = {
  name: 'pelindo_mdm',
  type: 'oracle',
  username,
  password,
  extra: {
    connectString: connectStringMDM,
  },
} as TypeOrmModuleOptions;

export const pelindoPEOOption: TypeOrmModuleOptions = {
  name: 'pelindo_peo',
  type: 'oracle',
  username: usernamePeo,
  password: passwordPeo,
  retryDelay: 10000,
  extra: {
    connectString: connectStringPeo,
  },
} as TypeOrmModuleOptions;
