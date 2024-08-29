import { Column, Model, Table } from 'sequelize-typescript';
import { MeasureDto } from 'src/dto/measure.dto';
import { MeasureStatus } from '../enum/measure.enum';

@Table
export class Measure extends Model<MeasureDto> implements MeasureDto {
  @Column({
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    allowNull: false,
    unique: true,
  })
  measure_uuid: string;

  @Column({
    allowNull: false,
  })
  image: string;

  @Column({
    allowNull: false,
  })
  customer_code: string;

  @Column({
    allowNull: true,
  })
  measure_value: number;

  @Column({
    allowNull: false,
  })
  measure_datetime: Date;

  @Column({
    allowNull: false,
  })
  measure_type: string;

  @Column({
    allowNull: false,
  })
  measure_status: MeasureStatus;
}
