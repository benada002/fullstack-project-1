import {
  Authorized, Field, ID, ObjectType,
} from 'type-graphql';
import {
  BaseEntity, Column, CreateDateColumn, Entity, Index, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { PaginatedResponse } from '../generics/paginated';
import Post from './Post';
import Role from './Role';
import Sub from './Sub';
import Vote from './Vote';

@ObjectType()
@Entity()
export default class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Index({ unique: true })
  @Column()
  username: string;

  @Field()
  @Column()
  name: string;

  @Authorized(['ADMIN', 'USER'])
  @Field()
  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @Field(() => [Vote])
  @OneToMany(() => Vote, ({ user }) => user)
  votes: Vote[];

  @Field(() => [Post])
  @OneToMany(() => Post, ({ author }) => author)
  posts: Post[];

  @Field(() => [Sub])
  @ManyToMany(() => Sub, ({ followers }) => followers)
  @JoinTable()
  following: Sub[];

  @ManyToOne(() => Role, ({ users }) => users)
  @JoinTable()
  roles: Role[];
}

@ObjectType()
export class PaginatedUserResponse extends PaginatedResponse(User) {}
