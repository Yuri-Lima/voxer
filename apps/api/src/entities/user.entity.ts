import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@Entity('users')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string;

  @Column({ unique: true })
  @Field()
  email!: string;

  @Column()
  password!: string; // Not exposed in GraphQL

  @Column({ nullable: true })
  @Field({ nullable: true })
  name?: string;

  @Column({ default: 'ADMIN' })
  @Field()
  role!: string;

  @Column({ default: true })
  @Field()
  isActive!: boolean;

  @Column({ nullable: true })
  resetToken?: string;

  @Column({ nullable: true })
  resetTokenExpiry?: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn()
  @Field()
  createdAt!: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt!: Date;
}

