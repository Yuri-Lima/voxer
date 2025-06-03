import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { VoxerPlugin, PluginMetadata, PluginType, PluginContext } from './interfaces/plugin.interface';

@Injectable()
export class PluginManagerService implements OnModuleInit {
  private readonly logger = new Logger(PluginManagerService.name);
  private plugins = new Map<string, VoxerPlugin>();
  private pluginsByType = new Map<PluginType, VoxerPlugin[]>();

  constructor(
    private moduleRef: ModuleRef,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.loadPlugins();
  }

  private async loadPlugins() {
    const pluginsDir = this.configService.get('PLUGINS_DIR', path.join(process.cwd(), 'plugins'));
    
    if (!fs.existsSync(pluginsDir)) {
      this.logger.warn(`Plugins directory not found: ${pluginsDir}`);
      return;
    }

    const pluginDirs = fs.readdirSync(pluginsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const pluginDir of pluginDirs) {
      try {
        await this.loadPlugin(path.join(pluginsDir, pluginDir));
      } catch (error) {
        this.logger.error(`Failed to load plugin ${pluginDir}:`, error);
      }
    }

    this.logger.log(`Loaded ${this.plugins.size} plugins`);
  }

  private async loadPlugin(pluginPath: string) {
    const packageJsonPath = path.join(pluginPath, 'package.json');
    const mainFilePath = path.join(pluginPath, 'index.js');

    if (!fs.existsSync(packageJsonPath) || !fs.existsSync(mainFilePath)) {
      throw new Error(`Invalid plugin structure in ${pluginPath}`);
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const pluginMetadata: PluginMetadata = packageJson.voxerPlugin;

    if (!pluginMetadata) {
      throw new Error(`Missing voxerPlugin metadata in ${packageJsonPath}`);
    }

    // Validar metadados obrigatórios
    if (!pluginMetadata.name || !pluginMetadata.version || !pluginMetadata.type) {
      throw new Error(`Invalid plugin metadata in ${packageJsonPath}`);
    }

    // Carregar o plugin dinamicamente
    const pluginModule = require(mainFilePath);
    const PluginClass = pluginModule.default || pluginModule;

    if (typeof PluginClass !== 'function') {
      throw new Error(`Plugin ${pluginMetadata.name} does not export a valid class`);
    }

    const pluginInstance: VoxerPlugin = new PluginClass();
    pluginInstance.metadata = pluginMetadata;

    // Registrar o plugin
    this.plugins.set(pluginMetadata.name, pluginInstance);
    
    if (!this.pluginsByType.has(pluginMetadata.type)) {
      this.pluginsByType.set(pluginMetadata.type, []);
    }
    this.pluginsByType.get(pluginMetadata.type)!.push(pluginInstance);

    this.logger.log(`Loaded plugin: ${pluginMetadata.name} v${pluginMetadata.version}`);
  }

  async executePlugin(pluginName: string, context: PluginContext): Promise<any> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      throw new Error(`Plugin not found: ${pluginName}`);
    }

    try {
      if (plugin.initialize) {
        await plugin.initialize(context);
      }
      
      const result = await plugin.execute(context);
      
      if (plugin.cleanup) {
        await plugin.cleanup();
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Plugin execution failed for ${pluginName}:`, error);
      throw error;
    }
  }

  async executePluginsByType(type: PluginType, context: PluginContext): Promise<any[]> {
    const plugins = this.pluginsByType.get(type) || [];
    const results = [];

    for (const plugin of plugins) {
      try {
        const result = await this.executePlugin(plugin.metadata.name, context);
        results.push(result);
      } catch (error) {
        this.logger.error(`Plugin ${plugin.metadata.name} failed:`, error);
        // Continue com outros plugins mesmo se um falhar
      }
    }

    return results;
  }

  getPlugin(name: string): VoxerPlugin | undefined {
    return this.plugins.get(name);
  }

  getPluginsByType(type: PluginType): VoxerPlugin[] {
    return this.pluginsByType.get(type) || [];
  }

  getAllPlugins(): VoxerPlugin[] {
    return Array.from(this.plugins.values());
  }

  getPluginMetadata(): PluginMetadata[] {
    return this.getAllPlugins().map(plugin => plugin.metadata);
  }
}

