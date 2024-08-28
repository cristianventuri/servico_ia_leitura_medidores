import { Injectable } from '@nestjs/common';
import { RequestUpload } from './dto/upload.dto';
import { RequestConfirm } from './dto/confirm.dto';
import { validate } from 'class-validator';

@Injectable()
export class AppService {

list(customer_code: string){
  return customer_code
}

  async upload(requestBody: RequestUpload){
    return 'upload'
  }

  async confirm(requestBody: RequestConfirm){
    return 'confirm'
  }

}
