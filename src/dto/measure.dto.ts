import { MeasureStatus } from 'src/enum/measure.enum';

export class MeasureDto {
  id: number;
  image: string;
  measure_uuid: string;
  customer_code: string;
  measure_datetime: Date;
  measure_value: number;
  measure_type: string;
  measure_status: MeasureStatus;
}
