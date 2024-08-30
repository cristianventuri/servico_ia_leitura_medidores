import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ParamList, QueryList, ResponseList } from 'src/dto/list.dto';
import { MeasureRepository } from './measure.repository';

@Injectable()
export class MeasureListService {
  constructor(private readonly measureRepository: MeasureRepository) {}

  /**
   * Responsável por listar as medidas realizadas por um determinado cliente
   *
   * @param {string} customer_code
   * @returns {Promise<ResponseList>}
   * @throws {NotFoundException}
   */
  public async list(
    requestData: Partial<ParamList & QueryList>,
  ): Promise<ResponseList> {
    const measures = await this.measureRepository.findAll(requestData);

    /* Se existirem registros */
    if (measures && measures?.length) {
      return {
        customer_code: requestData.customer_code,
        measures: measures,
      } as ResponseList;
    }

    throw new NotFoundException({
      status_code: HttpStatus.NOT_FOUND,
      message: 'Nenhum registro encontrado',
      error_code: 'MEASURES_NOT_FOUND',
      error_description: 'Nenhuma leitura encontrada',
    });
  }
}
