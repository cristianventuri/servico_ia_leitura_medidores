import {
  ArgumentMetadata,
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { MeasureUploadService } from 'src/measure/measureUpload.service';

@Injectable()
export class UploadBodyPipe implements PipeTransform {
  constructor(private readonly uploadService: MeasureUploadService) {}

  public async transform(body: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return body;
    }

    await this.validateErrors(metatype, body);
    await this.checkExistingMeasure(body);

    return body;
  }

  /**
   * Verifica se o metatype é válido
   *
   * @param {any} metatype
   * @returns
   */
  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype) && typeof metatype === 'function';
  }

  /**
   * Valida a estrutura de dados do body.
   *
   * @param {any} body
   * @returns {Promise<void>}
   * @throws {BadRequestException}
   */
  private async validateErrors(metatype: any, body: any) {
    const object = plainToInstance(metatype, body);
    const errors: ValidationError[] = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Os dados fornecidos no corpo da requisição são inválidos',
        error_code: 'INVALID_DATA',
        error_description: errors.flatMap((error) =>
          Object.values(error?.constraints ?? {}),
        ),
      });
    }
  }

  /**
   * Verifica se já existe medição pro mês atual, customer_code e measure_type.
   *
   * @param body
   * @returns {Promise<void>}
   * @throws {ConflictException}
   */
  private async checkExistingMeasure(body: any) {
    const existingMeasure = await this.uploadService.checkExistingMeasure(body);
    if (existingMeasure) {
      throw new ConflictException({
        status_code: HttpStatus.CONFLICT,
        message: 'Já existe uma leitura para este tipo no mês atual',
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });
    }
  }
}
