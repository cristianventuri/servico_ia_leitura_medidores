import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Measure } from './measure.model';

@Injectable()
export class MeasureRepository {
  constructor(
    @InjectModel(Measure)
    private readonly measureModel: typeof Measure,
  ) {}

  async create(data: Partial<Measure>): Promise<Measure> {
    return this.measureModel.create(data);
  }

  async findAll(): Promise<Measure[]> {
    return this.measureModel.findAll();
  }

  async findById(id: number): Promise<Measure> {
    return this.measureModel.findOne({ where: { id } });
  }

  async findByGuid(guid: string): Promise<Measure> {
    return this.measureModel.findOne({ where: { guid } });
  }

  async update(
    id: number,
    data: Partial<Measure>,
  ): Promise<[number, Measure[]]> {
    return this.measureModel.update(data, { where: { id }, returning: true });
  }

  async delete(id: number): Promise<void> {
    const measure = await this.findById(id);
    if (measure) {
      await measure.destroy();
    }
  }
}
