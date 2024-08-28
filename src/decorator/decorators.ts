import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { RequestConfirm } from 'src/dto/confirm.dto';

export class ErrorResponse {
  public statusCode: number;
  public message: string;
  public error: {
    error_code: string;
    error_description: any[] | string;
  };
}

/**
 * `ValidateBodyRequest` é um decorator customizado para validar objetos de requisição.
 *
 * @param {any} classType
 * @param ctx - O contexto da execução.
 * @returns Uma instância validada do objeto DTO, ou lança uma exceção `BadRequestException` se a validação falhar.
 * @throws {BadRequestException} Se a validação falhar, lança uma exceção contendo os detalhes dos erros.
 */
export const ValidateBodyRequest = createParamDecorator(
  (classType: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const body = request.body;
    const validatedObject = plainToInstance(classType, body);

    return validate(validatedObject).then((errors: ValidationError[]) => {
      /* Se possuir erros */
      if (errors.length) {
        const errorMessages =
          errors.flatMap((error) => Object.values(error?.constraints)) ?? [];

        if (validatedObject instanceof RequestConfirm) {
          throw new BadRequestException({
            statusCode: 400,
            message: 'Parâmetro measure type diferente de WATER ou GAS',
            error: {
              error_code: 'INVALID_TYPE',
              error_description: errorMessages,
            },
          });
        } else {
          throw new BadRequestException({
            statusCode: 400,
            message: 'Os dados fornecidos no corpo da requisição são inválidos',
            error: {
              error_code: 'INVALID_DATA',
              error_description: errorMessages,
            },
          });
        }
      }

      return validatedObject;
    });
  },
);
