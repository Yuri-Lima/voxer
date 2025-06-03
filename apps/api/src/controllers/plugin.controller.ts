import { Controller, Post, Body, Logger } from '@nestjs/common';
import { PluginManagerService } from '../modules/plugin/plugin-manager.service';
import { PluginType } from '../modules/plugin/interfaces/plugin.interface';

export interface ExecutePluginsByTypeDto {
  type: PluginType;
  context: {
    surveyId: string;
    responseId?: string;
    data: any;
    metadata?: Record<string, any>;
  };
}

@Controller('plugins')
export class PluginController {
  private readonly logger = new Logger(PluginController.name);

  constructor(private pluginManagerService: PluginManagerService) {}

  @Post('execute-by-type')
  async executePluginsByType(@Body() dto: ExecutePluginsByTypeDto) {
    try {
      this.logger.log(`Executing plugins of type: ${dto.type} for survey: ${dto.context.surveyId}`);
      
      const results = await this.pluginManagerService.executePluginsByType(
        dto.type,
        dto.context
      );

      return {
        success: true,
        type: dto.type,
        executedPlugins: results.length,
        results,
      };
    } catch (error) {
      this.logger.error(`Failed to execute plugins of type ${dto.type}:`, error);
      
      return {
        success: false,
        type: dto.type,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Post('execute')
  async executePlugin(@Body() dto: {
    pluginName: string;
    context: {
      surveyId: string;
      responseId?: string;
      data: any;
      metadata?: Record<string, any>;
    };
  }) {
    try {
      this.logger.log(`Executing plugin: ${dto.pluginName} for survey: ${dto.context.surveyId}`);
      
      const result = await this.pluginManagerService.executePlugin(
        dto.pluginName,
        dto.context
      );

      return {
        success: true,
        plugin: dto.pluginName,
        result,
      };
    } catch (error) {
      this.logger.error(`Failed to execute plugin ${dto.pluginName}:`, error);
      
      return {
        success: false,
        plugin: dto.pluginName,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

