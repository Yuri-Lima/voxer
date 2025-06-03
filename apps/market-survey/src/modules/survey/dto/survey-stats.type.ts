import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SurveyStatsType {
  @Field(() => Int)
  totalResponses!: number;

  @Field(() => Int)
  completedResponses!: number;

  @Field(() => Int)
  averageCompletionTime!: number; // em segundos

  @Field(() => String)
  responsesByDay!: string; // JSON string com dados por dia
}

