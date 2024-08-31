import {
  IsBase64,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { MeasureType } from '../enum/measure.enum';

export class ResponseUpload {
  public measure_uuid: string;
  public image_url: string;
  public measure_value: number;
}

export class RequestUpload {
  @IsNotEmpty({ message: 'image não definido' })
  @IsString({ message: 'image precisa estar no formato texto' })
  @IsBase64({}, { message: 'image precisa estar no formato Base64' })
  public image: string;

  @IsNotEmpty({ message: 'customer_code não definido' })
  @IsString({ message: 'customer_code inválido' })
  public customer_code: string;

  @IsNotEmpty({ message: 'measure_datetime não definido' })
  @IsDateString({}, { message: 'measure_datetime inválido' })
  public measure_datetime: Date;

  @IsNotEmpty({ message: 'measure_type não definido' })
  @IsEnum(MeasureType, { message: 'measure_type precisa ser GAS ou WATER' })
  public measure_type: MeasureType;
}
