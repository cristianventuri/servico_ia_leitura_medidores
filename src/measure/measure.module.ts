import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Measure } from './measure.model';
import { MeasureRepository } from './measure.repository';

@Module({
  imports: [SequelizeModule.forFeature([Measure])],
  providers: [MeasureRepository],
  exports: [MeasureRepository],
})
export class MeasureModule {}
