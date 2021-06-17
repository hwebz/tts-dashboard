export class ReviewDto {
  reviewCount: number;
  averageScore: number;
  dateGroup: string;
}

export class ReviewsDto {
  readonly reviews: ReviewDto[];
}