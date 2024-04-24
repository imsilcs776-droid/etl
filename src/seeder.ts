// import { ConfigModule } from '@nestjs/config';
// import { MongooseModule } from '@nestjs/mongoose';
// import { seeder } from 'nestjs-seeder';
// import databaseConfig from './configs/database.config';
// import { StatusSchema } from './modules/status/status.schema';
// import { StatusSeeder } from './seeders/status.seeder';

// seeder({
//   imports: [
//     ConfigModule.forRoot({
//       load: [databaseConfig],
//     }),
//     MongooseModule.forRoot(process.env.MONGODB_URL),
//     MongooseModule.forFeature([
//       {
//         name: 'Status',
//         schema: StatusSchema,
//       },
//     ]),
//   ],
// }).run([StatusSeeder]);
