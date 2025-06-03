import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PluginManagerService } from './plugin-manager.service';
import { PluginController } from '../../controllers/plugin.controller';

@Module({
  imports: [ConfigModule],
  controllers: [PluginController],
  providers: [PluginManagerService],
  exports: [PluginManagerService],
})
export class PluginModule {}

