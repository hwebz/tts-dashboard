import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hotel } from '../../hotel/entities/hotel.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Hotel, (hotel) => hotel.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @Column({ nullable: false })
  score: number;

  @Column({ length: 500 })
  comment: string;

  @Column({ type: 'date' })
  created_date: string;
}
