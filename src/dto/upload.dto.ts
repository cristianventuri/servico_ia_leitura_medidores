import {
  IsBase64,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { MeasureType } from 'src/enum/measure.enum';

export class ResponseUpload {
  public guid: string;
  public imageLink: string;
  public identifiedNumber: number;
}

export class RequestUpload {
  @IsNotEmpty()
  @IsBase64({}, { message: 'image precisa estar no formato Base64' })
  public image: string;

  @IsNotEmpty()
  @IsString({ message: 'customer_code inválido' })
  public customer_code: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'measure_datetime inválido' })
  public measure_datetime: Date;

  @IsNotEmpty()
  @IsEnum(MeasureType, { message: 'measure_type precisa ser "GAS" ou "WATER"' })
  public measure_type: MeasureType;
}
