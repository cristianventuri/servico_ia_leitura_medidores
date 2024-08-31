import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RequestConfirm, ResponseConfirm } from 'src/dto/confirm.dto';
import { Measure } from './measure.model';
import { MeasureRepository } from './measure.repository';
import { MeasureConfirmService } from './measureConfirm.service';

describe('MeasureConfirmService', () => {
  let service: MeasureConfirmService;
  let repository: MeasureRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeasureConfirmService,
        {
          provide: MeasureRepository,
          useValue: {
            findByUuid: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MeasureConfirmService>(MeasureConfirmService);
    repository = module.get<MeasureRepository>(MeasureRepository);
  });

  it('PRECISA ESTAR DEFINIDO CORRETAMENTE', () => {
    expect(service).toBeDefined();
  });

  describe('confirm', () => {
    it('PRECISA CONFIRMAR E SALVAR UMA MEDIDA CORRETAMENTE', async () => {
      const requestBody: RequestConfirm = {
        measure_uuid: '4d5c979c-6deb-4ac0-ac2c-736e79ac035b',
        confirmed_value: 101010,
      };

      const mockMeasure = {
        update: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
      } as unknown as Measure;

      jest.spyOn(repository, 'findByUuid').mockResolvedValue(mockMeasure);

      const result: ResponseConfirm = await service.confirm(requestBody);

      expect(result).toEqual({
        success: true,
      });
      expect(repository.findByUuid).toHaveBeenCalledWith(
        requestBody.measure_uuid,
      );
      expect(mockMeasure.update).toHaveBeenCalledWith({
        measure_value: requestBody.confirmed_value,
        has_confirmed: true,
      });
      expect(mockMeasure.save).toHaveBeenCalled();
    });

    it('LANÇA UMA NOTFOUNDEXCEPTION QUANDO NENHUM REGISTRO FOR ENCONTRADO', async () => {
      const requestBody: RequestConfirm = {
        measure_uuid: '4d5c979c-6deb-4ac0-ac2c-736e79ac035b',
        confirmed_value: 150,
      };

      jest.spyOn(repository, 'findByUuid').mockResolvedValue(null);

      await expect(service.confirm(requestBody)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findByUuid).toHaveBeenCalledWith(
        requestBody.measure_uuid,
      );
    });
  });

  describe('checkExistingMeasure', () => {
    it('PRECISA RETORNAR UMA MEDIDA EXISTENTE', async () => {
      const requestBody = { measure_uuid: 'uuid1' };

      const mockMeasure = {
        id: 1,
        image_url: 'http://localhost/public',
        measure_uuid: '4d5c979c-6deb-4ac0-ac2c-736e79ac035b',
        customer_code: '1',
        measure_type: 'WATER',
        measure_datetime: new Date(),
        measure_value: 100,
        has_confirmed: true,
      } as Measure;

      jest.spyOn(repository, 'findByUuid').mockResolvedValue(mockMeasure);

      const result = await service.checkExistingMeasure(requestBody);

      expect(result).toEqual(mockMeasure);
      expect(repository.findByUuid).toHaveBeenCalledWith(
        requestBody.measure_uuid,
      );
    });
  });
});
