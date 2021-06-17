import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('/findByFilter')
  findByHotelAndCreatedDate(
    @Query('hotelId') hotelId: number,
    @Query('fromDate') fromDate: Date,
    @Query('toDate') toDate: Date,
  ) {
    if (!hotelId || !fromDate || !toDate) {
      throw new HttpException('Incomplete information', 400);
    }

    return this.reviewService.findByHotelAndCreatedDate(
      hotelId,
      fromDate,
      toDate,
    );
  }
}
