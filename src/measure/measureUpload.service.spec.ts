import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import * as path from 'path';
import { RequestUpload, ResponseUpload } from '../dto/upload.dto';
import { MeasureType } from '../enum/measure.enum';
import { Measure } from './measure.model';
import { MeasureRepository } from './measure.repository';
import { MeasureUploadService } from './measureUpload.service';

describe('MeasureUploadService', () => {
  let service: MeasureUploadService;
  let repository: MeasureRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeasureUploadService,
        {
          provide: MeasureRepository,
          useValue: {
            create: jest.fn(),
            checkExistingMeasure: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MeasureUploadService>(MeasureUploadService);
    repository = module.get<MeasureRepository>(MeasureRepository);
  });

  it('PRECISA ESTAR DEFINIDO CORRETAMENTE', () => {
    expect(service).toBeDefined();
  });

  describe('upload', () => {
    it('PRECISA PROCESSAR O UPLOAD E RETORNAR A RESPOSTA CORRETA', async () => {
      const requestBody: RequestUpload = {
        image: 'iVBORw0KGgoAAAANSUhEUgAAAAU...',
        customer_code: '1',
        measure_datetime: new Date(),
        measure_type: MeasureType.WATER,
      };

      const result = await service.upload(requestBody);
      const mockMeasure: ResponseUpload = {
        measure_value: 10010,
        ...result,
      };

      const measure: Partial<Measure> = {
        ...mockMeasure,
        customer_code: requestBody.customer_code,
        measure_datetime: requestBody.measure_datetime,
        measure_type: requestBody.measure_type,
      };

      jest.spyOn(repository, 'create').mockResolvedValue(undefined);

      expect(repository.create).toHaveBeenCalledWith(measure);
      expect(result).toEqual(mockMeasure);
    });

    it('PRECISA GERAR O ARQUIVO TEMPORÁRIO CORRETAMENTE', async () => {
      const file = {
        type: 'jpeg',
        uuid: '397a87e2-63e2-43ef-a2da-836b09a32733',
        path: '/public',
        content: 'iVBORw0KGgoAAAANSUhEUgAAAAU...',
      };

      const mockExistsSync = jest
        .spyOn(fs, 'existsSync')
        .mockReturnValue(false);
      const mockMkdirSync = jest.spyOn(fs, 'mkdirSync').mockImplementation();
      const mockWriteFileSync = jest
        .spyOn(fs, 'writeFileSync')
        .mockImplementation();

      const fullPath = await service['generateTempFile'](file);

      expect(mockExistsSync).toHaveBeenCalledWith(file.path);
      expect(mockMkdirSync).toHaveBeenCalledWith(file.path, {
        recursive: true,
      });
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        fullPath,
        file.content,
        'base64',
      );
      expect(fullPath).toEqual(
        path.join(file.path, `${file.uuid}.${file.type}`),
      );
    });

    it('DEVE IDENTIFICAR CORRETAMENTE O TIPO DE IMAGEM', async () => {
      const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAU...';
      const fileType = await service['getFileType'](base64Image);

      expect(fileType).toEqual('png');
    });

    it('PRECISA VALIDAR A EXISTÊNCIA DE UMA DETERMINADA MEDIÇÃO', async () => {
      const measure_datetime = new Date();
      const requestUpload: RequestUpload = {
        image: 'iVBORw0KGgoAAAANSUhEUgAAAAU...',
        customer_code: '1',
        measure_datetime,
        measure_type: MeasureType.WATER,
      };

      const mockMeasure = {
        id: 1,
        image_url:
          'http://localhost/public/397a87e2-63e2-43ef-a2da-836b09a32733.jpeg',
        measure_uuid: '397a87e2-63e2-43ef-a2da-836b09a32733',
        customer_code: '1',
        measure_type: 'WATER',
        measure_datetime,
        measure_value: 100,
        has_confirmed: true,
      } as Measure;

      jest
        .spyOn(repository, 'checkExistingMeasure')
        .mockResolvedValue(mockMeasure);

      const result = await service.checkExistingMeasure(requestUpload);

      expect(result).toEqual(mockMeasure);
      expect(repository.checkExistingMeasure).toHaveBeenCalledWith(
        requestUpload,
      );
    });
  });
});
