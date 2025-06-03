export * from './en.json';
export * from './pt-br.json';
export * from './es.json';

export const supportedLanguages = ['en', 'pt-br', 'es'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

export const defaultLanguage: SupportedLanguage = 'en';

export interface TranslationKeys {
  common: {
    title: string;
    submit: string;
    cancel: string;
    save: string;
    edit: string;
    delete: string;
    loading: string;
    error: string;
    success: string;
  };
  survey: {
    title: string;
    description: string;
    question: string;
    answer: string;
    required: string;
    optional: string;
    multipleChoice: string;
    singleChoice: string;
    textInput: string;
    numberInput: string;
    dateInput: string;
    emailInput: string;
  };
  admin: {
    dashboard: string;
    surveys: string;
    responses: string;
    users: string;
    settings: string;
    createSurvey: string;
    editSurvey: string;
    deleteSurvey: string;
    viewResponses: string;
    exportData: string;
  };
  auth: {
    login: string;
    logout: string;
    email: string;
    password: string;
    forgotPassword: string;
    invalidCredentials: string;
    loginSuccess: string;
    logoutSuccess: string;
  };
}

