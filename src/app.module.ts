import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { MetricsService } from './metrics/metrics.service';
import { MetricsController } from './metrics/metrics.controller';
import { ItemsController } from './items/items.controller';
import { ItemsService } from './items/items.service';
import { MetricsModule } from './metrics/metrics.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { PrometheusController } from './prometheus/controller/prometheus.controller';
import { PrometheusService } from './prometheus/services/prometheus.service';

@Module({
  imports: [ItemsModule, MetricsModule],
  // imports: [PrometheusModule.register()],
  // imports: [PrometheusModule],
  // controllers: [AppController, PrometheusController],
  controllers: [AppController, MetricsController, ItemsController],
  // providers: [AppService, PrometheusService],
  providers: [AppService, MetricsService, ItemsService],
})
export class AppModule {}
