import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
  ) {}

  async findAll(): Promise<Hotel[]> {
    return await this.hotelRepository.find();
  }
}
