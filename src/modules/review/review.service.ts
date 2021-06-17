import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import * as moment from 'moment';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async findByHotelAndCreatedDate(
    hotelId: number,
    fromDate: Date,
    toDate: Date,
  ): Promise<any> {
    const diffInDays = moment(toDate).diff(moment(fromDate), 'days');

    const dateGroup =
      diffInDays < 30 ? 'daily' : diffInDays < 90 ? 'weekly' : 'monthly';

    let result;
    switch (dateGroup) {
      case 'daily':
        result = await this.getDailyData(hotelId, fromDate, toDate);
        break;
      case 'weekly':
        result = await this.getWeeklyData(hotelId, fromDate, toDate);
        break;
      case 'monthly':
        result = await this.getMonthlyData(hotelId, fromDate, toDate);
        break;
      default:
        result = [];
    }

    return result;
  }

  getDays(fromDate, toDate) {
    const arr = [];
    for (
      let dt = new Date(fromDate);
      dt < toDate;
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(moment(dt).format('YYYY-MM-DD'));
    }
    return arr;
  }

  async getDailyData(hotelId, fromDate, toDate) {
    const dayList = this.getDays(new Date(fromDate), new Date(toDate));
    const result = [];
    for (const day of dayList) {
      const queryResult = await getRepository(Review)
        .createQueryBuilder('review')
        .select('COUNT(review.id)', 'reviewCount')
        .addSelect('ROUND(AVG(score))', 'averageScore')
        .where('review.hotel_id = :hotelId', { hotelId })
        .andWhere('review.created_date >= :day', { day })
        .andWhere('review.created_date <= :day', { day })
        .getRawOne();
      result.push({
        reviewCount: queryResult['reviewCount'] ?? 0,
        averageScore: queryResult['averageScore'] ?? 0,
        dateGroup: day,
      });
    }
    return result;
  }

  getWeeks(fromDate, toDate) {
    const format = 'YYYY-MM-DD';
    const start = moment(fromDate, format);
    const end = moment(toDate, format);
    const result = [];
    while (start.isBefore(end)) {
      const weekStartEndDates = {
        start: start.startOf('week').isBefore(fromDate)
          ? fromDate
          : start.startOf('week').format(format),
        end: start.endOf('week').isAfter(toDate)
          ? toDate
          : start.endOf('week').format(format),
      };
      result.push(weekStartEndDates);
      start.add(6 - moment().day(), 'day');
    }
    return result;
  }

  async getWeeklyData(hotelId, fromDate, toDate) {
    const weeks = this.getWeeks(fromDate, toDate);
    const result = [];
    for (const week of weeks) {
      const queryResult = await getRepository(Review)
        .createQueryBuilder('review')
        .select('COUNT(review.id)', 'reviewCount')
        .addSelect('ROUND(AVG(score))', 'averageScore')
        .where('review.hotel_id = :hotelId', { hotelId })
        .andWhere('review.created_date >= :day', { day: week.start })
        .andWhere('review.created_date <= :day', { day: week.end })
        .getRawOne();
      result.push({
        reviewCount: queryResult['reviewCount'] ?? 0,
        averageScore: queryResult['averageScore'] ?? 0,
        dateGroup: `${week.start} - ${week.end}`,
      });
    }
    return result;
  }

  getMonths(fromDate, toDate) {
    const format = 'YYYY-MM-DD';
    const start = moment(fromDate, format);
    const end = moment(toDate, format);
    const result = [];
    while (start.isBefore(end) || start.format('M') === end.format('M')) {
      const monthStartEndDates = {
        start: start.isSame(fromDate)
          ? fromDate
          : start.startOf('month').format(format),
        end: start.endOf('month').isAfter(toDate)
          ? toDate
          : start.endOf('month').format(format),
      };
      result.push(monthStartEndDates);
      start.add(1, 'month');
    }
    return result;
  }

  async getMonthlyData(hotelId, fromDate, toDate) {
    const monthList = this.getMonths(fromDate, toDate);
    const result = [];
    for (const month of monthList) {
      const queryResult = await getRepository(Review)
        .createQueryBuilder('review')
        .select('COUNT(review.id)', 'reviewCount')
        .addSelect('ROUND(AVG(score))', 'averageScore')
        .where('review.hotel_id = :hotelId', { hotelId })
        .andWhere('review.created_date >= :day', { day: month.start })
        .andWhere('review.created_date <= :day', { day: month.end })
        .getRawOne();
      result.push({
        reviewCount: queryResult['reviewCount'] ?? 0,
        averageScore: queryResult['averageScore'] ?? 0,
        dateGroup: moment(month.start, 'YYYY-MM-DD').format('YYYY-MM'),
      });
    }
    return result;
  }
}
