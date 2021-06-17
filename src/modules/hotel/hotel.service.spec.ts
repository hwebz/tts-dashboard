import { Test, TestingModule } from '@nestjs/testing';
import { HotelService } from './hotel.service';
import { Repository } from 'typeorm';
import { Hotel } from './entities/hotel.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HotelRepositoryFake } from './hotel.repository.fake';

describe('HotelService', () => {
  let service: HotelService;
  let repository: Repository<Hotel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HotelService,
        {
          provide: getRepositoryToken(Hotel),
          useClass: HotelRepositoryFake,
        },
      ],
    }).compile();

    service = module.get<HotelService>(HotelService);
    repository = module.get(getRepositoryToken(Hotel));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
