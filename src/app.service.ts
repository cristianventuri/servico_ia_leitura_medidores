import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Retorna se o serviço está rodando
   *
   * @returns {string}
   */
  public isRunning(): string {
    return 'Service is Running.';
  }
}
