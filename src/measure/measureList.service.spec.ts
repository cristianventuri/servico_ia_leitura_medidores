import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ParamList, QueryList, ResponseList } from 'src/dto/list.dto';
import { Measure } from './measure.model';
import { MeasureRepository } from './measure.repository';
import { MeasureListService } from './measureList.service';

describe('MeasureListService', () => {
  let service: MeasureListService;
  let repository: MeasureRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeasureListService,
        {
          provide: MeasureRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MeasureListService>(MeasureListService);
    repository = module.get<MeasureRepository>(MeasureRepository);
  });

  it('PRECISA ESTAR DEFINIDO CORRETAMENTE', () => {
    expect(service).toBeDefined();
  });

  describe('list', () => {
    it('PRECISA RETORNAR A LISTA DE MEDIDAS EXISTENTES NA BASE DE DADOS', async () => {
      const requestData: Partial<ParamList & QueryList> = {
        customer_code: '1',
      };

      const mockMeasures: Partial<Measure[]> = [
        {
          id: 1,
          image_url: 'http://localhost/public',
          measure_uuid: '4d5c979c-6deb-4ac0-ac2c-736e79ac035b',
          customer_code: '1',
          measure_type: 'WATER',
          measure_datetime: new Date(),
          measure_value: 100,
          has_confirmed: true,
        },
        {
          id: 2,
          image_url: 'http://localhost/public',
          measure_uuid: '4d5c979c-6deb-4ac0-ac2c-736e79ac035C',
          customer_code: '2',
          measure_type: 'GAS',
          measure_datetime: new Date(),
          measure_value: 200,
          has_confirmed: false,
        },
      ] as Measure[];

      jest.spyOn(repository, 'findAll').mockResolvedValue(mockMeasures);

      const result = await service.list(requestData);

      expect(result).toEqual({
        customer_code: '1',
        measures: mockMeasures,
      } as ResponseList);
      expect(repository.findAll).toHaveBeenCalledWith(requestData);
    });

    it('LANÇA UMA NOTFOUNDEXCEPTION QUANDO NENHUM REGISTRO FOR ENCONTRADO', async () => {
      const requestData: Partial<ParamList & QueryList> = {
        customer_code: '50',
      };

      jest.spyOn(repository, 'findAll').mockResolvedValue([]);

      await expect(service.list(requestData)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findAll).toHaveBeenCalledWith(requestData);
    });
  });
});
