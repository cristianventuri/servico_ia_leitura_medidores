import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ResponseConfirm {
  public success: boolean;
}

export class RequestConfirm {
  @IsNotEmpty({ message: 'measure_uuid não definido' })
  @IsString({ message: 'measure_uuid inválido' })
  public measure_uuid: string;

  @IsNotEmpty({ message: 'confirmed_value não definido' })
  @IsNumber({}, { message: 'confirmed_value inválido' })
  public confirmed_value: number;
}
