import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestUpload } from './dto/upload.dto';
import { RequestConfirm } from './dto/confirm.dto';
import { ValidateBodyRequest } from './decorator/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  isRunning(): string {
    return 'Running';
  }

  /**
   * Responsável por listar as medidas realizadas por um determinado cliente
   *
   * @param {string} customer_code
   * @returns
   */
  @Get(':customer_code/list')
  async list(@Param('customer_code') customer_code:string) {
    return this.appService.list(customer_code);
  }

  /**
   * Responsável por receber uma imagem em base 64, consultar o Gemini e retornar a medida lida pela API
   *
   * @returns
   */
  @Post('upload')
  async upload(@ValidateBodyRequest(RequestUpload) requestUpload: RequestUpload) {
    return this.appService.upload(requestUpload);
  }
  
  /**
   * Responsável por confirmar ou corrigir o valor lido pelo LLM
  *
  * @returns
  */
 @Patch('confirm')
 async confirm(@ValidateBodyRequest(RequestConfirm) requestConfirm: RequestConfirm) {
    return this.appService.confirm(requestConfirm);
  }
}
