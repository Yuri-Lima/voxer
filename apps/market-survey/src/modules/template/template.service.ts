import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyTemplate, SurveyType, SurveyStatus } from '@voxer/api';

export interface MarketSurveyTemplateData {
  title: string;
  description?: string;
  schema: Record<string, any>;
  settings?: Record<string, any>;
  targetAudience?: string;
  estimatedDuration?: number; // em minutos
}

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(SurveyTemplate)
    private surveyTemplateRepository: Repository<SurveyTemplate>,
  ) { }

  async createMarketSurveyTemplate(data: MarketSurveyTemplateData): Promise<SurveyTemplate> {
    const template = this.surveyTemplateRepository.create({
      title: data.title,
      description: data.description,
      type: SurveyType.MARKET_RESEARCH,
      status: SurveyStatus.ACTIVE,
      schema: data.schema,
      settings: {
        ...data.settings,
        targetAudience: data.targetAudience,
        estimatedDuration: data.estimatedDuration,
        createdBy: 'market-survey-microservice',
      },
      isPublic: true, // Templates de pesquisa de mercado são públicos por padrão
    });

    return this.surveyTemplateRepository.save(template);
  }

  async getMarketSurveyTemplates(): Promise<SurveyTemplate[]> {
    return this.surveyTemplateRepository.find({
      where: {
        type: SurveyType.MARKET_RESEARCH,
        isPublic: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async updateMarketSurveyTemplate(
    id: string,
    data: Partial<MarketSurveyTemplateData>
  ): Promise<SurveyTemplate> {
    const template = await this.surveyTemplateRepository.findOne({
      where: { id, type: SurveyType.MARKET_RESEARCH },
    });

    if (!template) {
      throw new Error(`Market survey template not found: ${id}`);
    }

    // Atualizar campos permitidos
    if (data.title) template.title = data.title;
    if (data.description !== undefined) template.description = data.description;
    if (data.schema) template.schema = data.schema;
    if (data.settings || data.targetAudience || data.estimatedDuration) {
      template.settings = {
        ...template.settings,
        ...data.settings,
        targetAudience: data.targetAudience || template.settings?.targetAudience,
        estimatedDuration: data.estimatedDuration || template.settings?.estimatedDuration,
      };
    }

    return this.surveyTemplateRepository.save(template);
  }

  async deleteMarketSurveyTemplate(id: string): Promise<boolean> {
    const result = await this.surveyTemplateRepository.delete({
      id,
      type: SurveyType.MARKET_RESEARCH,
    });

    return result.affected ? result.affected > 0 : false;
  }

  // Templates pré-definidos para pesquisa de mercado
  async createDefaultMarketSurveyTemplates(): Promise<SurveyTemplate[]> {
    const templates = [
      {
        title: 'Customer Satisfaction Survey',
        description: 'Measure customer satisfaction with products or services',
        schema: {
          fields: [
            {
              id: 'overall_satisfaction',
              type: 'rating',
              label: 'Overall Satisfaction',
              required: true,
              options: { min: 1, max: 5, labels: ['Very Dissatisfied', 'Very Satisfied'] }
            },
            {
              id: 'recommendation',
              type: 'rating',
              label: 'How likely are you to recommend us?',
              required: true,
              options: { min: 0, max: 10, labels: ['Not at all likely', 'Extremely likely'] }
            },
            {
              id: 'feedback',
              type: 'textarea',
              label: 'Additional feedback',
              required: false,
              options: { maxLength: 500 }
            }
          ]
        },
        targetAudience: 'Existing customers',
        estimatedDuration: 3,
      },
      {
        title: 'Product Feedback Survey',
        description: 'Collect feedback on specific products or features',
        schema: {
          fields: [
            {
              id: 'product_usage',
              type: 'multiple_choice',
              label: 'How often do you use this product?',
              required: true,
              options: {
                choices: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never']
              }
            },
            {
              id: 'features_rating',
              type: 'matrix',
              label: 'Rate the following features',
              required: true,
              options: {
                rows: ['Ease of use', 'Performance', 'Design', 'Value for money'],
                columns: ['Poor', 'Fair', 'Good', 'Excellent']
              }
            },
            {
              id: 'improvements',
              type: 'textarea',
              label: 'What improvements would you suggest?',
              required: false,
              options: { maxLength: 300 }
            }
          ]
        },
        targetAudience: 'Product users',
        estimatedDuration: 5,
      }
    ];

    const createdTemplates = [];
    for (const templateData of templates) {
      const template = await this.createMarketSurveyTemplate(templateData);
      createdTemplates.push(template);
    }

    return createdTemplates;
  }
}

