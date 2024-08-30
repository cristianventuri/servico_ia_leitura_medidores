import {
  ArgumentMetadata,
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { MeasureConfirmService } from 'src/measure/measureConfirm.service';

@Injectable()
export class ConfirmBodyPipe implements PipeTransform {
  constructor(private readonly confirmService: MeasureConfirmService) {}

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
   * @param metatype
   * @returns
   */
  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype) && typeof metatype === 'function';
  }

  /**
   * Valida a estrutura de dados do body.
   *
   * @param body
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
   * Verifica se existe uma medição correspondente e lida com casos específicos.
   *
   * @param body
   * @returns {Promise<void>}
   * @throws {NotFoundException} - Se a medição não for encontrada.
   * @throws {ConflictException} - Se a medição já tiver sido confirmada.
   */
  private async checkExistingMeasure(body: any) {
    const foundMeasure = await this.confirmService.checkExistingMeasure(body);

    /* Caso não encontrar pelo UUID */
    if (!foundMeasure) {
      throw new NotFoundException({
        status_code: HttpStatus.NOT_FOUND,
        message: 'Leitura não encontrada',
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Leitura do mês já realizada',
      });
    }

    /* Caso a leitura já tiver sido confirmada */
    if (foundMeasure?.has_confirmed) {
      throw new ConflictException({
        status_code: HttpStatus.CONFLICT,
        message: 'Leitura já confirmada',
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Leitura do mês já realizada',
      });
    }
  }
}
