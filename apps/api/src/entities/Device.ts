import {
  BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import User from './User';

@Entity()
export default class Device extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  user: User;
}
