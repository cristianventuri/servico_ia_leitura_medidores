import { IsNotEmpty, IsString } from 'class-validator';
import { MeasureType } from '../enum/measure.enum';
import { Measure } from '../measure/measure.model';

export class ParamList {
  @IsNotEmpty({ message: 'customer_code não definido' })
  @IsString({ message: 'customer_code inválido' })
  public customer_code: string;
}

export class QueryList {
  @IsString({ message: 'measure_type inválido' })
  public measure_type?: MeasureType;
}

export class ResponseList {
  public customer_code: string;
  public measures: Partial<Measure>[];
}
