import { Injectable } from '@nestjs/common';
import { RequestConfirm, ResponseConfirm } from 'src/dto/confirm.dto';
import { Measure } from './measure.model';
import { MeasureRepository } from './measure.repository';

@Injectable()
export class MeasureConfirmService {
  constructor(private readonly measureRepository: MeasureRepository) {}

  /**
   * Responsável por confirmar ou corrigir o valor lido pelo LLM
   *
   * @param {RequestConfirm} requestBody
   * @returns {Promise<ResponseConfirm>}
   */
  public async confirm(requestBody: RequestConfirm): Promise<ResponseConfirm> {
    const measure = await this.checkExistingMeasure(requestBody);

    await measure.update({
      measure_value: requestBody.confirmed_value,
      has_confirmed: true,
    });

    const isSavedMeasure = await measure.save();
    return {
      success: !!isSavedMeasure,
    };
  }

  /**
   * Verifica se existe medição com base no UUID
   *
   * @param {any} body
   * @returns {Promise<Measure>}
   */
  public async checkExistingMeasure(body: any): Promise<Measure> {
    return this.measureRepository.findByUuid(body.measure_uuid);
  }
}
