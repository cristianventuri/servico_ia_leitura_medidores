import { Column, Model, Table } from 'sequelize-typescript';

export interface IMeasure {
  id: number;
  image_url: string;
  measure_uuid: string;
  customer_code: string;
  measure_datetime: Date;
  measure_value: number;
  measure_type: string;
  has_confirmed: boolean;
}

@Table
export class Measure extends Model<IMeasure> implements IMeasure {
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
  image_url: string;

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
    defaultValue: false,
  })
  has_confirmed: boolean;
}
