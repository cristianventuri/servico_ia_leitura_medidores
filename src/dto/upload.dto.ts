import { IsBase64, IsDate, IsEnum, IsString, isDate, isEnum, isString } from "class-validator"

export enum MeasureType {
  WATER = "WATER",
  GAS = "GAS",
}

export class ResponseUpload {
  public guid: string
  public imageLink: string
  public identifiedNumber: number
}

export class RequestUpload {
  @IsBase64({}, {message: 'image precisa estar no formato Base64'})
  public image: string

  @IsString({message: 'customer_code inválido'})
  public customer_code: string

  @IsDate({message: 'measure_datetime inválido'})
  public measure_datetime: Date

  @IsEnum(MeasureType, {message: 'measure_type precisa ser "GAS" ou "WATER"' })
  public measure_type: MeasureType
}


