import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Measure } from './measure.model';
import { MeasureRepository } from './measure.repository';
import { MeasureConfirmService } from './measureConfirm.service';
import { MeasureListService } from './measureList.service';
import { MeasureUploadService } from './measureUpload.service';

@Module({
  imports: [SequelizeModule.forFeature([Measure])],
  providers: [
    MeasureUploadService,
    MeasureListService,
    MeasureConfirmService,
    MeasureRepository,
  ],
  exports: [
    MeasureUploadService,
    MeasureListService,
    MeasureConfirmService,
    MeasureRepository,
  ],
})
export class MeasureModule {}
