import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SurveyTemplate {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  schema: any;
  settings?: any;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SurveyResponse {
  id: string;
  surveyTemplateId: string;
  answers: any;
  status: string;
  metadata?: any;
  completedAt?: string;
  createdAt: string;
}

export interface SurveyStats {
  totalResponses: number;
  completedResponses: number;
  averageCompletionTime: number;
  responsesByDay: string;
}

export interface SubmitSurveyData {
  templateId: string;
  answers: any;
  respondentInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  metadata?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  constructor(private apollo: Apollo) {}

  // Query para buscar todas as pesquisas públicas de mercado
  getPublicMarketSurveys(): Observable<SurveyTemplate[]> {
    return this.apollo.query<{ publicMarketSurveys: SurveyTemplate[] }>({
      query: gql`
        query GetPublicMarketSurveys {
          publicMarketSurveys {
            id
            title
            description
            type
            status
            schema
            settings
            isPublic
            createdAt
            updatedAt
          }
        }
      `,
    }).pipe(
      map(result => result.data.publicMarketSurveys)
    );
  }

  // Query para buscar uma pesquisa específica
  getPublicMarketSurvey(id: string): Observable<SurveyTemplate | null> {
    return this.apollo.query<{ publicMarketSurvey: SurveyTemplate }>({
      query: gql`
        query GetPublicMarketSurvey($id: ID!) {
          publicMarketSurvey(id: $id) {
            id
            title
            description
            type
            status
            schema
            settings
            isPublic
            createdAt
            updatedAt
          }
        }
      `,
      variables: { id },
    }).pipe(
      map(result => result.data.publicMarketSurvey)
    );
  }

  // Mutation para submeter uma pesquisa
  submitMarketSurvey(data: SubmitSurveyData): Observable<SurveyResponse> {
    return this.apollo.mutate<{ submitMarketSurvey: SurveyResponse }>({
      mutation: gql`
        mutation SubmitMarketSurvey($input: SubmitMarketSurveyInput!) {
          submitMarketSurvey(input: $input) {
            id
            surveyTemplateId
            answers
            status
            metadata
            completedAt
            createdAt
          }
        }
      `,
      variables: {
        input: data,
      },
    }).pipe(
      map(result => result.data!.submitMarketSurvey)
    );
  }

  // Query para buscar estatísticas de uma pesquisa
  getMarketSurveyStats(templateId: string): Observable<SurveyStats> {
    return this.apollo.query<{ marketSurveyStats: SurveyStats }>({
      query: gql`
        query GetMarketSurveyStats($templateId: ID!) {
          marketSurveyStats(templateId: $templateId) {
            totalResponses
            completedResponses
            averageCompletionTime
            responsesByDay
          }
        }
      `,
      variables: { templateId },
    }).pipe(
      map(result => result.data.marketSurveyStats)
    );
  }
}

