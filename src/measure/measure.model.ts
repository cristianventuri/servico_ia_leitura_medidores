import { Column, Model, Table } from 'sequelize-typescript';
import { MeasureStatus } from './measure.enum';

@Table
export class Measure extends Model<Measure> {
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
  guid: string;

  @Column({
    allowNull: false,
  })
  image: string;

  @Column({
    allowNull: false,
  })
  custumer_code: string;

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
  status: MeasureStatus;
}
