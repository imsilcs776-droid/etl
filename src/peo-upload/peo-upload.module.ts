import { Module } from '@nestjs/common';
import { PeoUploadController } from './peo-upload.controller';
import { PeoUploadService } from './peo-upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DivisiMvEntity } from './entities/divisi.mv.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DivisiMvEntity])],
  controllers: [PeoUploadController],
  providers: [PeoUploadService],
  exports: [PeoUploadService],
})
export class PeoUploadModule {}
