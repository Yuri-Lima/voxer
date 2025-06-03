import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { MarketSurveyService } from '../../services/market-survey.service';
import { SurveyTemplate } from '../../../../../apps/api/src/entities/survey-template.entity';
import { SurveyResponse } from '../../../../../apps/api/src/entities/survey-response.entity';
import { SubmitMarketSurveyInput } from './dto/submit-market-survey.input';
import { SurveyStatsType } from './dto/survey-stats.type';

@Resolver(() => SurveyTemplate)
export class MarketSurveyResolver {
  constructor(private marketSurveyService: MarketSurveyService) {}

  @Query(() => [SurveyTemplate])
  async publicMarketSurveys(): Promise<SurveyTemplate[]> {
    return this.marketSurveyService.getAllPublicMarketSurveys();
  }

  @Query(() => SurveyTemplate, { nullable: true })
  async publicMarketSurvey(@Args('id', { type: () => ID }) id: string): Promise<SurveyTemplate | null> {
    return this.marketSurveyService.getPublicSurveyTemplate(id);
  }

  @Mutation(() => SurveyResponse)
  async submitMarketSurvey(@Args('input') input: SubmitMarketSurveyInput): Promise<SurveyResponse> {
    return this.marketSurveyService.submitSurvey({
      templateId: input.templateId,
      answers: input.answers,
      respondentInfo: input.respondentInfo,
      metadata: input.metadata,
    });
  }

  @Query(() => SurveyStatsType)
  async marketSurveyStats(@Args('templateId', { type: () => ID }) templateId: string): Promise<SurveyStatsType> {
    const stats = await this.marketSurveyService.getSurveyStats(templateId);
    return {
      totalResponses: stats.totalResponses,
      completedResponses: stats.completedResponses,
      averageCompletionTime: stats.averageCompletionTime,
      responsesByDay: JSON.stringify(stats.responsesByDay),
    };
  }
}

