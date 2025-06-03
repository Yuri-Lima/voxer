import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { SurveyTemplate, SurveyType } from '../../../../apps/api/src/entities/survey-template.entity';
import { SurveyResponse, ResponseStatus } from '../../../../apps/api/src/entities/survey-response.entity';
import { Respondent } from '../../../../apps/api/src/entities/respondent.entity';

export interface SubmitSurveyData {
  templateId: string;
  answers: Record<string, any>;
  respondentInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  metadata?: Record<string, any>;
}

@Injectable()
export class MarketSurveyService {
  private readonly logger = new Logger(MarketSurveyService.name);
  private readonly apiBaseUrl: string;

  constructor(
    @InjectRepository(SurveyTemplate)
    private surveyTemplateRepository: Repository<SurveyTemplate>,
    @InjectRepository(SurveyResponse)
    private surveyResponseRepository: Repository<SurveyResponse>,
    @InjectRepository(Respondent)
    private respondentRepository: Repository<Respondent>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiBaseUrl = this.configService.get('API_BASE_URL', 'http://localhost:3001');
  }

  async getPublicSurveyTemplate(id: string): Promise<SurveyTemplate | null> {
    const template = await this.surveyTemplateRepository.findOne({
      where: {
        id,
        isPublic: true,
        type: SurveyType.MARKET_RESEARCH
      },
    });

    if (!template) {
      throw new NotFoundException(`Public market research survey not found: ${id}`);
    }

    return template;
  }

  async getAllPublicMarketSurveys(): Promise<SurveyTemplate[]> {
    return this.surveyTemplateRepository.find({
      where: {
        isPublic: true,
        type: SurveyType.MARKET_RESEARCH
      },
      order: { createdAt: 'DESC' },
    });
  }

  async submitSurvey(data: SubmitSurveyData): Promise<SurveyResponse> {
    const { templateId, answers, respondentInfo, metadata } = data;

    // Verificar se o template existe e é público
    const template = await this.getPublicSurveyTemplate(templateId);

    // Criar ou encontrar respondente se informações foram fornecidas
    let respondent: Respondent | undefined;
    if (respondentInfo && (respondentInfo.email || respondentInfo.name)) {
      respondent = await this.createOrFindRespondent(respondentInfo);
    }

    // Criar resposta
    const response = this.surveyResponseRepository.create({
      surveyTemplateId: templateId,
      respondentId: respondent?.id,
      answers,
      status: ResponseStatus.COMPLETED,
      metadata: {
        ...metadata,
        submittedVia: 'market-survey-microservice',
        timestamp: new Date().toISOString(),
      },
      completedAt: new Date(),
    });

    const savedResponse = await this.surveyResponseRepository.save(response);

    // Ativar plugins por tipo
    if (template) {
      await this.activatePluginsByType(template, savedResponse);
    }

    this.logger.log(`Survey response submitted: ${savedResponse.id} for template: ${templateId}`);

    return savedResponse;
  }

  private async createOrFindRespondent(respondentInfo: {
    name?: string;
    email?: string;
    phone?: string;
  }): Promise<Respondent> {
    // Tentar encontrar respondente existente por email
    if (respondentInfo.email) {
      const existing = await this.respondentRepository.findOne({
        where: { email: respondentInfo.email },
      });

      if (existing) {
        // Atualizar informações se necessário
        if (respondentInfo.name && !existing.name) {
          existing.name = respondentInfo.name;
        }
        if (respondentInfo.phone && !existing.phone) {
          existing.phone = respondentInfo.phone;
        }
        return this.respondentRepository.save(existing);
      }
    }

    // Criar novo respondente
    const respondent = this.respondentRepository.create({
      name: respondentInfo.name,
      email: respondentInfo.email,
      phone: respondentInfo.phone,
      metadata: {
        source: 'market-survey-microservice',
        createdAt: new Date().toISOString(),
      },
    });

    return this.respondentRepository.save(respondent);
  }

  private async activatePluginsByType(
    template: SurveyTemplate,
    response: SurveyResponse
  ): Promise<void> {
    try {
      // Chamar a API principal para executar plugins
      const pluginContext = {
        surveyId: template.id,
        responseId: response.id,
        data: response.answers,
        metadata: {
          surveyType: template.type,
          templateSettings: template.settings,
          responseMetadata: response.metadata,
        },
      };

      // Executar plugins de webhook para pesquisas de mercado
      await this.executePlugins('webhook', pluginContext);

      // Executar plugins de notificação
      await this.executePlugins('notification', pluginContext);

      this.logger.log(`Plugins activated for response: ${response.id}`);
    } catch (error) {
      this.logger.error(`Failed to activate plugins for response ${response.id}:`, error);
      // Não falhar a submissão se plugins falharem
    }
  }

  private async executePlugins(type: string, context: any): Promise<void> {
    try {
      const url = `${this.apiBaseUrl}/plugins/execute-by-type`;
      const payload = {
        type,
        context,
      };

      await firstValueFrom(
        this.httpService.post(url, payload, {
          timeout: 10000, // 10 segundos timeout
        })
      );

      this.logger.log(`Executed ${type} plugins successfully`);
    } catch (error: any) {
      this.logger.error(`Failed to execute ${type} plugins:`, error.message);
      throw error;
    }
  }

  async getSurveyStats(templateId: string): Promise<{
    totalResponses: number;
    completedResponses: number;
    averageCompletionTime: number;
    responsesByDay: Record<string, number>;
  }> {
    const template = await this.getPublicSurveyTemplate(templateId);

    const responses = await this.surveyResponseRepository.find({
      where: { surveyTemplateId: templateId },
      order: { createdAt: 'ASC' },
    });

    const completedResponses = responses.filter(r => r.status === ResponseStatus.COMPLETED);

    // Calcular tempo médio de conclusão (simplificado)
    const avgTime = completedResponses.reduce((acc, response) => {
      if (response.completedAt && response.createdAt) {
        const diff = response.completedAt.getTime() - response.createdAt.getTime();
        return acc + diff;
      }
      return acc;
    }, 0) / completedResponses.length || 0;

    // Respostas por dia
    const responsesByDay: Record<string, number> = {};
    responses.forEach(response => {
      const day = response.createdAt.toISOString().split('T')[0];
      responsesByDay[day] = (responsesByDay[day] || 0) + 1;
    });

    return {
      totalResponses: responses.length,
      completedResponses: completedResponses.length,
      averageCompletionTime: Math.round(avgTime / 1000), // em segundos
      responsesByDay,
    };
  }
}

