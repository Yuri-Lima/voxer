import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { SurveyService } from './survey.service';
import { SurveyTemplate, SurveyType } from '../../entities/survey-template.entity';
import { SurveyResponse } from '../../entities/survey-response.entity';
import { Respondent } from '../../entities/respondent.entity';
import { CreateSurveyTemplateInput } from './dto/create-survey-template.input';
import { UpdateSurveyTemplateInput } from './dto/update-survey-template.input';
import { SubmitSurveyResponseInput } from './dto/submit-survey-response.input';
import { CreateRespondentInput } from './dto/create-respondent.input';

@Resolver(() => SurveyTemplate)
export class SurveyResolver {
  constructor(private surveyService: SurveyService) {}

  @Query(() => [SurveyTemplate])
  async surveyTemplates(): Promise<SurveyTemplate[]> {
    return this.surveyService.getAllSurveyTemplates();
  }

  @Query(() => SurveyTemplate, { nullable: true })
  async surveyTemplate(@Args('id', { type: () => ID }) id: string): Promise<SurveyTemplate | null> {
    return this.surveyService.getSurveyTemplate(id);
  }

  @Mutation(() => SurveyTemplate)
  async createSurveyTemplate(@Args('input') input: CreateSurveyTemplateInput): Promise<SurveyTemplate> {
    return this.surveyService.createSurveyTemplate(input);
  }

  @Mutation(() => SurveyTemplate)
  async updateSurveyTemplate(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateSurveyTemplateInput,
  ): Promise<SurveyTemplate> {
    return this.surveyService.updateSurveyTemplate(id, input);
  }

  @Mutation(() => Boolean)
  async deleteSurveyTemplate(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.surveyService.deleteSurveyTemplate(id);
  }

  @Query(() => [SurveyResponse])
  async surveyResponses(@Args('surveyTemplateId', { type: () => ID }) surveyTemplateId: string): Promise<SurveyResponse[]> {
    return this.surveyService.getSurveyResponses(surveyTemplateId);
  }

  @Query(() => SurveyResponse, { nullable: true })
  async surveyResponse(@Args('id', { type: () => ID }) id: string): Promise<SurveyResponse | null> {
    return this.surveyService.getSurveyResponse(id);
  }

  @Mutation(() => SurveyResponse)
  async submitSurveyResponse(@Args('input') input: SubmitSurveyResponseInput): Promise<SurveyResponse> {
    return this.surveyService.submitSurveyResponse(input);
  }

  @Mutation(() => Respondent)
  async createRespondent(@Args('input') input: CreateRespondentInput): Promise<Respondent> {
    return this.surveyService.createRespondent(input);
  }

  @Query(() => Respondent, { nullable: true })
  async respondent(@Args('id', { type: () => ID }) id: string): Promise<Respondent | null> {
    return this.surveyService.getRespondent(id);
  }
}

