import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from '../../review/entities/review.entity';

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @OneToMany(() => Review, (review) => review.hotel, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  reviews: Review[];
}
