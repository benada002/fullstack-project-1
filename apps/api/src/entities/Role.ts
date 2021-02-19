import {
  BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import User from './User';

@Entity()
export default class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleName: string;

  @ManyToMany(() => User, ({ roles }) => roles)
  users: User[];
}
