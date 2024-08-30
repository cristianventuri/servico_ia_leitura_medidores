import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UsePipes,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { RequestConfirm, ResponseConfirm } from './dto/confirm.dto';
import { ParamList, QueryList, ResponseList } from './dto/list.dto';
import { RequestUpload, ResponseUpload } from './dto/upload.dto';
import { MeasureConfirmService } from './measure/measureConfirm.service';
import { MeasureListService } from './measure/measureList.service';
import { MeasureUploadService } from './measure/measureUpload.service';
import { ConfirmBodyPipe } from './pipes/confirmBodyPipe';
import { ListValidatePipe } from './pipes/listValidatePipe';
import { UploadBodyPipe } from './pipes/uploadBodyPipe';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly listService: MeasureListService,
    private readonly uploadService: MeasureUploadService,
    private readonly confirmService: MeasureConfirmService,
  ) {}

  /**
   * Verifica se o serviço está rodando.
   *
   * @returns {string}
   */
  @Get()
  isRunning(): string {
    return this.appService.isRunning();
  }

  /**
   * Responsável por receber uma imagem em base64, consultar o Gemini e retornar a medida lida pela API
   *
   * @param {RequestUpload} requestUpload
   * @param {Response} response
   * @returns {Promise<ResponseUpload>}
   */
  @Post('upload')
  @UsePipes(UploadBodyPipe)
  async upload(
    @Body() requestUpload: RequestUpload,
    @Res() response: Response,
  ) {
    const measure: ResponseUpload =
      await this.uploadService.upload(requestUpload);

    response.status(HttpStatus.OK).json({
      message: 'Operação realizada com sucesso',
      ...measure,
    });
  }

  /**
   * Responsável por confirmar ou corrigir o valor lido pelo LLM
   *
   * @param {RequestConfirm} requestConfirm
   * @param {Response} response
   * @returns {Promise<ResponseConfirm>}
   */
  @Patch('confirm')
  @UsePipes(ConfirmBodyPipe)
  async confirm(
    @Body() requestConfirm: RequestConfirm,
    @Res() response: Response,
  ) {
    const measure: ResponseConfirm =
      await this.confirmService.confirm(requestConfirm);

    response.status(HttpStatus.OK).json({
      message: 'Operação realizada com sucesso',
      ...measure,
    });
  }

  /**
   * Responsável por listar as medidas realizadas por um determinado cliente
   *
   * @param {string} customerCode
   * @param {MeasureType} measureType
   * @param {Response} response
   *
   */
  @Get(':customer_code/list')
  @UsePipes(ListValidatePipe)
  async list(
    @Param() params: ParamList,
    @Query() querys: QueryList,
    @Res() response: Response,
  ) {
    const measure: ResponseList = await this.listService.list({
      ...params,
      ...querys,
    });

    response.status(HttpStatus.OK).json({
      message: 'Operação realizada com sucesso',
      measure,
    });
  }
}
