import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
import { SurveyResponse } from './survey-response.entity';

@Entity('respondents')
@ObjectType()
export class Respondent {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id!: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @Column('jsonb', { nullable: true })
  @Field(() => String, { nullable: true })
  @IsOptional()
  metadata?: Record<string, any>;

  @OneToMany(() => SurveyResponse, response => response.respondent)
  @Field(() => [SurveyResponse], { nullable: true })
  responses?: SurveyResponse[];

  @CreateDateColumn()
  @Field()
  createdAt!: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt!: Date;
}

