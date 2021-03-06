import { Controller, Get } from '@nestjs/common';
import { HotelService } from './hotel.service';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get()
  findAll() {
    return this.hotelService.findAll();
  }
}
