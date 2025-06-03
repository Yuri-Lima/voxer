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
  respondentId?: string;
  answers: any;
  status: string;
  metadata?: any;
  completedAt?: string;
  createdAt: string;
}

export interface Respondent {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  metadata?: any;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateSurveyTemplateInput {
  title: string;
  description?: string;
  type: string;
  schema: any;
  settings?: any;
  isPublic?: boolean;
}

export interface UpdateSurveyTemplateInput {
  title?: string;
  description?: string;
  schema?: any;
  settings?: any;
  isPublic?: boolean;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private apollo: Apollo) {}

  // Survey Templates
  getAllSurveyTemplates(): Observable<SurveyTemplate[]> {
    return this.apollo.query<{ surveyTemplates: SurveyTemplate[] }>({
      query: gql`
        query GetAllSurveyTemplates {
          surveyTemplates {
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
      map(result => result.data.surveyTemplates)
    );
  }

  getSurveyTemplate(id: string): Observable<SurveyTemplate> {
    return this.apollo.query<{ surveyTemplate: SurveyTemplate }>({
      query: gql`
        query GetSurveyTemplate($id: ID!) {
          surveyTemplate(id: $id) {
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
      map(result => result.data.surveyTemplate)
    );
  }

  createSurveyTemplate(input: CreateSurveyTemplateInput): Observable<SurveyTemplate> {
    return this.apollo.mutate<{ createSurveyTemplate: SurveyTemplate }>({
      mutation: gql`
        mutation CreateSurveyTemplate($input: CreateSurveyTemplateInput!) {
          createSurveyTemplate(input: $input) {
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
      variables: { input },
    }).pipe(
      map(result => result.data!.createSurveyTemplate)
    );
  }

  updateSurveyTemplate(id: string, input: UpdateSurveyTemplateInput): Observable<SurveyTemplate> {
    return this.apollo.mutate<{ updateSurveyTemplate: SurveyTemplate }>({
      mutation: gql`
        mutation UpdateSurveyTemplate($id: ID!, $input: UpdateSurveyTemplateInput!) {
          updateSurveyTemplate(id: $id, input: $input) {
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
      variables: { id, input },
    }).pipe(
      map(result => result.data!.updateSurveyTemplate)
    );
  }

  deleteSurveyTemplate(id: string): Observable<boolean> {
    return this.apollo.mutate<{ deleteSurveyTemplate: boolean }>({
      mutation: gql`
        mutation DeleteSurveyTemplate($id: ID!) {
          deleteSurveyTemplate(id: $id)
        }
      `,
      variables: { id },
    }).pipe(
      map(result => result.data!.deleteSurveyTemplate)
    );
  }

  // Survey Responses
  getSurveyResponses(templateId?: string): Observable<SurveyResponse[]> {
    return this.apollo.query<{ surveyResponses: SurveyResponse[] }>({
      query: gql`
        query GetSurveyResponses($templateId: ID) {
          surveyResponses(templateId: $templateId) {
            id
            surveyTemplateId
            respondentId
            answers
            status
            metadata
            completedAt
            createdAt
          }
        }
      `,
      variables: templateId ? { templateId } : {},
    }).pipe(
      map(result => result.data.surveyResponses)
    );
  }

  getSurveyResponse(id: string): Observable<SurveyResponse> {
    return this.apollo.query<{ surveyResponse: SurveyResponse }>({
      query: gql`
        query GetSurveyResponse($id: ID!) {
          surveyResponse(id: $id) {
            id
            surveyTemplateId
            respondentId
            answers
            status
            metadata
            completedAt
            createdAt
          }
        }
      `,
      variables: { id },
    }).pipe(
      map(result => result.data.surveyResponse)
    );
  }

  // Respondents
  getRespondents(): Observable<Respondent[]> {
    return this.apollo.query<{ respondents: Respondent[] }>({
      query: gql`
        query GetRespondents {
          respondents {
            id
            name
            email
            phone
            metadata
            createdAt
          }
        }
      `,
    }).pipe(
      map(result => result.data.respondents)
    );
  }

  // Dashboard Statistics
  getDashboardStats(): Observable<any> {
    return this.apollo.query<{ dashboardStats: any }>({
      query: gql`
        query GetDashboardStats {
          dashboardStats {
            totalSurveys
            totalResponses
            totalRespondents
            activeSurveys
            recentResponses {
              id
              surveyTemplateId
              createdAt
            }
            responsesByDay {
              date
              count
            }
          }
        }
      `,
    }).pipe(
      map(result => result.data.dashboardStats)
    );
  }
}

