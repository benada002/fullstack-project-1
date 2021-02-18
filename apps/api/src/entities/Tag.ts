import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import Post from './Post';
import Sub from './Sub';

@ObjectType()
@Entity()
export default class Tag extends BaseEntity {
  @Field()
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
  @ManyToMany(() => Post, ({ tags }) => tags)
  posts: Post[];

  @Field(() => [Sub])
  @ManyToOne(() => Sub, ({ tags }) => tags)
  sub: Sub;
}
