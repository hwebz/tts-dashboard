import { Test, TestingModule } from '@nestjs/testing';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';

describe('HotelController', () => {
  let controller: HotelController;
  let service: HotelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelController],
      providers: [HotelService],
    }).compile();

    service = module.get<HotelService>(HotelService);
    controller = module.get<HotelController>(HotelController);
  });

  describe('findAll', () => {
    it('GET hotel list', async () => {
      const result = ['test'];
      // jest.spyOn(service, 'findAll').mockImplementation(() => ());

      expect(await controller.findAll()).toBe(result);
    });
  });
});
