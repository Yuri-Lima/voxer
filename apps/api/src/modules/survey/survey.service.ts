import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyTemplate, SurveyType, SurveyStatus } from '../../entities/survey-template.entity';
import { SurveyResponse, ResponseStatus } from '../../entities/survey-response.entity';
import { Respondent } from '../../entities/respondent.entity';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(SurveyTemplate)
    private surveyTemplateRepository: Repository<SurveyTemplate>,
    @InjectRepository(SurveyResponse)
    private surveyResponseRepository: Repository<SurveyResponse>,
    @InjectRepository(Respondent)
    private respondentRepository: Repository<Respondent>,
  ) { }

  async createSurveyTemplate(data: {
    title: string;
    description?: string;
    type: SurveyType;
    schema: Record<string, any>;
    settings?: Record<string, any>;
    createdById?: string;
  }): Promise<SurveyTemplate> {
    const template = this.surveyTemplateRepository.create(data);
    return this.surveyTemplateRepository.save(template);
  }

  async getSurveyTemplate(id: string): Promise<SurveyTemplate | null> {
    return this.surveyTemplateRepository.findOne({
      where: { id },
      relations: ['createdBy', 'responses'],
    });
  }

  async getAllSurveyTemplates(): Promise<SurveyTemplate[]> {
    return this.surveyTemplateRepository.find({
      relations: ['createdBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateSurveyTemplate(id: string, data: Partial<SurveyTemplate>): Promise<SurveyTemplate> {
    await this.surveyTemplateRepository.update(id, data);
    const template = await this.getSurveyTemplate(id);
    if (!template) {
      throw new Error(`Survey template with id ${id} not found`);
    }
    return template;
  }

  async deleteSurveyTemplate(id: string): Promise<boolean> {
    const result = await this.surveyTemplateRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async submitSurveyResponse(data: {
    surveyTemplateId: string;
    answers: Record<string, any>;
    respondentId?: string;
    sessionId?: string;
    metadata?: Record<string, any>;
  }): Promise<SurveyResponse> {
    const response = this.surveyResponseRepository.create({
      ...data,
      status: ResponseStatus.COMPLETED,
      completedAt: new Date(),
    });

    return this.surveyResponseRepository.save(response);
  }

  async getSurveyResponse(id: string): Promise<SurveyResponse | null> {
    return this.surveyResponseRepository.findOne({
      where: { id },
      relations: ['surveyTemplate', 'respondent'],
    });
  }

  async getSurveyResponses(surveyTemplateId: string): Promise<SurveyResponse[]> {
    return this.surveyResponseRepository.find({
      where: { surveyTemplateId },
      relations: ['respondent'],
      order: { createdAt: 'DESC' },
    });
  }

  async createRespondent(data: {
    name?: string;
    email?: string;
    phone?: string;
    metadata?: Record<string, any>;
  }): Promise<Respondent> {
    const respondent = this.respondentRepository.create(data);
    return this.respondentRepository.save(respondent);
  }

  async getRespondent(id: string): Promise<Respondent | null> {
    return this.respondentRepository.findOne({
      where: { id },
      relations: ['responses'],
    });
  }
}

