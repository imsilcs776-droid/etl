import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
const connectStringPeo = process.env.CONNECT_STRING_PEO;
const connectStringPortalsi = process.env.CONNECT_STRING_PORTALSI;
const usernamePortalsi = process.env.IMS_DB_USERNAME;
const passwordPortalsi = process.env.IMS_DB_PASSWORD;

const usernamePeo = process.env.PEO_DB_USERNAME;
const passwordPeo = process.env.PEO_DB_PASSWORD;

export const pelindoPortalsiOption: TypeOrmModuleOptions = {
  name: 'pelindo_portalsi',
  type: 'oracle',
  username: usernamePortalsi.trim(),
  password: passwordPortalsi.trim(),
  extra: {
    connectString: connectStringPortalsi.trim(),
  },
} as TypeOrmModuleOptions;

export const pelindoPEOOption: TypeOrmModuleOptions = {
  name: 'pelindo_peo',
  type: 'oracle',
  username: usernamePeo.trim(),
  password: passwordPeo.trim(),
  retryDelay: 10000,
  extra: {
    connectString: connectStringPeo.trim(),
  },
} as TypeOrmModuleOptions;
