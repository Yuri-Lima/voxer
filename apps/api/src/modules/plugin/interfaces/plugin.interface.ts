export interface PluginMetadata {
  name: string;
  version: string;
  description: string;
  author: string;
  type: PluginType;
  dependencies?: string[];
  permissions?: string[];
}

export enum PluginType {
  FIELD_TYPE = 'field_type',
  WEBHOOK = 'webhook',
  INTEGRATION = 'integration',
  VALIDATION = 'validation',
  NOTIFICATION = 'notification',
}

export interface PluginContext {
  surveyId: string;
  responseId?: string;
  data: any;
  metadata?: Record<string, any>;
}

export interface VoxerPlugin {
  metadata: PluginMetadata;
  initialize?(context: PluginContext): Promise<void>;
  execute(context: PluginContext): Promise<any>;
  cleanup?(): Promise<void>;
}

