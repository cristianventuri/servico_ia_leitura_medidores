import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { ParamList, QueryList } from 'src/dto/list.dto';
import { Measure } from './measure.model';

@Injectable()
export class MeasureRepository {
  constructor(
    @InjectModel(Measure)
    private readonly measureModel: typeof Measure,
  ) {}

  /**
   * Realiza a inserção de novos registros no banco de dados.
   *
   * @param { Partial<Measure>} data
   * @returns {Promise<Measure>}
   */
  public async create(data: Partial<Measure>): Promise<Measure> {
    return this.measureModel.create(data);
  }

  /**
   * Verifica a existência de determinada medição.
   *
   * @param {Partial<Measure>} data
   * @returns {Promise<Measure>}
   */
  public async checkExistingMeasure(data: Partial<Measure>): Promise<Measure> {
    return this.measureModel.findOne({
      where: {
        customer_code: data.customer_code,
        measure_type: data.measure_type,
        measure_datetime: {
          [Op.between]: [
            Sequelize.literal("DATE_TRUNC('month', NOW())"),
            Sequelize.literal(
              "DATE_TRUNC('month', NOW()) + INTERVAL '1 month - 1 second'",
            ),
          ],
        },
      },
    });
  }

  /**
   * Realiza a busca da medição com base no UUID
   *
   * @param measure_uuid
   * @returns {Promise<Measure>}
   */
  public async findByUuid(measure_uuid: string): Promise<Measure> {
    return this.measureModel.findOne({ where: { measure_uuid } });
  }

  /**
   * Realiza a busca de todas as medições com base no data
   *
   * @param measure_uuid
   * @returns {Promise<Measure[]>}
   */
  public async findAll(
    data: Partial<ParamList & QueryList>,
  ): Promise<Measure[]> {
    return this.measureModel.findAll({
      where: {
        ...data,
      },
    });
  }
}
