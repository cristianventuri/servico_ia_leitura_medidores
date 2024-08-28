import { IsNumber, IsString } from 'class-validator';

export class ResponseConfirm {
  public guid: string;
  public imageLink: string;
  public identifiedNumber: number;
}

export class RequestConfirm {
  @IsString({ message: 'measure_uuid inválido' })
  public measure_uuid: string;

  @IsNumber({}, { message: 'confirmed_value inválido' })
  public confirmed_value: number;
}
