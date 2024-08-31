import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import * as path from 'path';
import { RequestUpload, ResponseUpload } from '../dto/upload.dto';
import { PUBLIC_DIR } from '../enum/directories.enum';
import GoogleFileManager from '../integration/googleAI';
import { Measure } from './measure.model';
import { MeasureRepository } from './measure.repository';

const { v4: uuid } = require('uuid');

@Injectable()
export class MeasureUploadService {
  constructor(private readonly measureRepository: MeasureRepository) {}

  /**
   * Responsável por receber uma imagem em base64, consultar o Gemini e retornar a medida lida pela API
   *
   * @param {RequestUpload} requestBody
   * @returns { Promise<ResponseUpload>}
   */
  public async upload(requestBody: RequestUpload): Promise<ResponseUpload> {
    const file = {
      type: await this.getFileType(requestBody.image),
      uuid: uuid(),
      path: PUBLIC_DIR,
      content: requestBody.image,
    };

    const responseUpload = new ResponseUpload();
    responseUpload.measure_uuid = file.uuid;
    responseUpload.measure_value = await this.processDataIA(file);
    responseUpload.image_url = path.join(
      'http://localhost:80/public',
      `${file.uuid}.${file.type}`,
    );

    const measure: Partial<Measure> = {
      ...responseUpload,
      customer_code: requestBody.customer_code,
      measure_datetime: requestBody.measure_datetime,
      measure_type: requestBody.measure_type,
    };

    await this.measureRepository.create(measure);
    return responseUpload;
  }

  /**
   * Processa os dados e verifica a leitura do arquivo com auxilio da IA
   *
   * @param {any} file
   * @returns {Promise<number>}
   */
  private async processDataIA(file: any): Promise<number> {
    const fullPath = await this.generateTempFile(file);
    const measureValue = await GoogleFileManager({
      image: {
        path: fullPath,
        type: `image/${file.type}`,
        name: `${file.uuid}.${file.type}`,
      },
      prompt: `Identifique o valor numérico exibido no medidor de água ou gás com base na imagem fornecida. 
				Retorne somente valor em formato numérico sem quaisquer descrições adicionais.
				Considere que a imagem pode ser de um medidor utilizado no Brasil e pode estar rotacionada ou com baixa resolução.`,
    });

    return +measureValue;
  }

  /**
   * Gera a imagem fisica
   *
   * @param measure
   * @returns {Promise<string>}
   */
  private async generateTempFile(file: any): Promise<string> {
    const dirPathExists = await existsSync(file.path);
    const fullPath = path.join(file.path, `${file.uuid}.${file.type}`);

    if (!dirPathExists) {
      await mkdirSync(file.path, { recursive: true });
    }

    await writeFileSync(fullPath, file.content, 'base64');
    return fullPath;
  }

  /**
   * Realiza a identificação do tipo da imagem com base no buffer
   *
   * @param base64String
   * @returns {Promise<string>}
   */
  private async getFileType(base64String): Promise<string> {
    let base64Data = '';

    try {
      base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    } catch (error) {
      base64Data = base64String;
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const imageTypes = {
      jpeg: Buffer.from([0xff, 0xd8]),
      png: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      gif: Buffer.from([0x47, 0x49, 0x46, 0x38]),
      webp: Buffer.from([0x52, 0x49, 0x46, 0x46]),
      bmp: Buffer.from([0x42, 0x4d]),
      tiff: Buffer.from([0x49, 0x49, 0x2a, 0x00]),
      svg: Buffer.from([0x3c, 0x3f, 0x78, 0x6d, 0x6c]),
      ico: Buffer.from([0x00, 0x00, 0x01, 0x00]),
    };

    for (const type in imageTypes) {
      if (buffer.slice(0, imageTypes[type].length).equals(imageTypes[type])) {
        return type;
      }
    }

    return 'jpeg';
  }

  /**
   * Valida a existência de determinada medição
   *
   * @param {Partial<Measure>} data
   * @returns {Promise<Measure>}
   */
  public async checkExistingMeasure(measure: RequestUpload): Promise<Measure> {
    return this.measureRepository.checkExistingMeasure(measure);
  }
}
