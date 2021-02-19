import {
  Field, ID, Int, ObjectType,
} from 'type-graphql';
import {
  BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { PaginatedResponse } from '../generics/paginated';
import Sub from './Sub';
import Tag from './Tag';
import User from './User';
import Vote from './Vote';

@ObjectType()
class PostSub {
  @Field()
  id: number;

  @Field()
  name: string;
}

@ObjectType()
export class PostTag {
  @Field()
  id: number;

  @Field()
  name: string;
}

@ObjectType()
@Entity()
export default class Post extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  content: string;

  @Field(() => User)
  @ManyToOne(() => User, ({ posts }) => posts)
  author: User;

  @Field(() => PostSub)
  @ManyToOne(() => Sub, ({ posts }) => posts)
  sub: Sub;

  @OneToMany(() => Vote, ({ post }) => post)
  votes: Vote[];

  @Field(() => Int)
  vote: number;

  @Field(() => [PostTag])
  @ManyToMany(() => Tag, ({ posts }) => posts)
  @JoinTable()
  tags: Tag[];
}

@ObjectType()
export class PaginatedPostResponse extends PaginatedResponse(Post) {}
