import { Controller, Get } from '@nestjs/common';
import { MetricsService } from './metrics.service'; // Import MetricsService

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {} // Inject MetricsService

  @Get()
  async getMetrics() {
    return this.metricsService.getMetrics(); // Use MetricsService
  }
}