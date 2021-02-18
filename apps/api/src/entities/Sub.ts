import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import { PaginatedResponse } from '../generics/paginated';
import Post from './Post';
import Tag from './Tag';
import User from './User';

@ObjectType()
@Entity()
export default class Sub extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @Field()
  @Column()
  name: string;

  @Field(() => [Post])
  @OneToMany(() => Post, ({ sub }) => sub)
  posts: Post[];

  @Field(() => [Tag])
  @OneToMany(() => Tag, ({ sub }) => sub)
  tags: Tag[];

  @Field(() => [User])
  @ManyToMany(() => User, ({ following }) => following)
  followers: User[];
}
export class PaginatedSubResponse extends PaginatedResponse(Sub) {}
