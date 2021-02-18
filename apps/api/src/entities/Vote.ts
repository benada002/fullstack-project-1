import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import Post from './Post';
import User from './User';

@ObjectType()
@Entity()
export default class Vote extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  value: number;

  @ManyToOne(() => User, ({ votes }) => votes)
  user: User;

  @ManyToOne(() => Post, ({ vote }) => vote)
  post: Post;
}
