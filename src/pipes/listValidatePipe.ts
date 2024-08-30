import {
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { MeasureType } from 'src/enum/measure.enum';
import { MeasureListService } from 'src/measure/measureList.service';

@Injectable()
export class ListValidatePipe implements PipeTransform {
  constructor(private readonly listService: MeasureListService) {}

  public async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    await this.validateErrors(value);
    return value;
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
   * Valida a estrutura de dados .
   *
   * @param {any} value
   * @returns {Promise<void>}
   * @throws {BadRequestException}
   */
  private async validateErrors(value: any) {
    if (value.hasOwnProperty('measure_type')) {
      if (Object.values(MeasureType).includes(value.measure_type)) {
        return;
      }

      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Parâmetro measure_type diferente de WATER ou GAS ',
        error_code: 'INVALID_TYPE',
        error_description: 'Tipo de medição não permitida',
      });
    }
  }
}
