// import { Injectable } from '@nestjs/common';
// import { Counter, Histogram, register } from 'prom-client';

// @Injectable()
// export class MetricsService {
//   private readonly requestCounter: Counter<string>;
//   private readonly requestDuration: Histogram<string>;

//   constructor() {
//     register.clear();

//     register.setDefaultLabels({
//       app: 'nestjs-crud-prometheus',
//     });

//     this.requestCounter = new Counter({
//       name: 'nestjs_requests_total',
//       help: 'Total number of requests to the NestJS app',
//     });

//     this.requestDuration = new Histogram({
//       name: 'nestjs_request_duration_seconds',
//       help: 'Duration of requests to the NestJS app in seconds',
//       buckets: [0.1, 0.5, 1, 2.5, 5, 10],
//     });

//     register.registerMetric(this.requestCounter);
//     register.registerMetric(this.requestDuration);
//   }

//   incrementRequestCounter(): void {
//     this.requestCounter.inc();
//   }

//   startTimer(): ReturnType<Histogram<string>['startTimer']> {
//     return this.requestDuration.startTimer();
//   }
// }

// import { Injectable } from '@nestjs/common';
// import { Counter, Histogram, register } from 'prom-client';

// @Injectable()
// export class MetricsService {
//   private readonly requestCounter: Counter<string>;
//   private readonly requestDuration: Histogram<string>;

//   constructor() {
//     register.clear();

//     register.setDefaultLabels({
//       app: 'nestjs-crud-prometheus',
//     });

//     this.requestCounter = new Counter({
//       name: 'items_request_count',
//       help: 'Total number of requests to items',
//       labelNames: ['method'],
//     });

//     this.requestDuration = new Histogram({
//       name: 'items_request_duration_seconds',
//       help: 'Duration of requests to items in seconds',
//       labelNames: ['method', 'route'],
//     });

//     register.registerMetric(this.requestCounter);
//     register.registerMetric(this.requestDuration);
//   }

//   incrementRequestCounter(method: string) {
//     this.requestCounter.inc({ method });
//   }

//   startRequestTimer(method: string, route: string) {
//     const end = this.requestDuration.labels(method, route).startTimer();
//     return end;
//   }
// }

import { Injectable, Logger } from '@nestjs/common';
import { Counter, Histogram, Gauge, register } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);
  private readonly requestCounter: Counter<string>;
  private readonly requestDuration: Histogram<string>;
  private readonly activeRequests: Gauge<string>;
  private readonly errorCounter: Counter<string>;

  constructor() {
    register.clear();

    register.setDefaultLabels({
      app: 'nestjs-crud-prometheus',
    });

    this.requestCounter = new Counter({
      name: 'api_request_count',
      help: 'Total number of API requests',
      labelNames: ['method', 'route', 'status'],
    });

    this.requestDuration = new Histogram({
      name: 'api_request_duration_seconds',
      help: 'Duration of API requests in seconds',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.1, 0.3, 0.5, 1, 2, 5],
    });

    this.activeRequests = new Gauge({
      name: 'api_active_requests',
      help: 'Number of currently active API requests',
      labelNames: ['method', 'route'],
    });

    this.errorCounter = new Counter({
      name: 'api_error_count',
      help: 'Total number of API errors',
      labelNames: ['method', 'route', 'error_type'],
    });

    register.registerMetric(this.requestCounter);
    register.registerMetric(this.requestDuration);
    register.registerMetric(this.activeRequests);
    register.registerMetric(this.errorCounter);
  }

  trackRequest(method: string, route: string) {
    const startTime = Date.now();
    const end = this.requestDuration.startTimer();
    this.activeRequests.inc({ method, route });

    return (status: number, error?: Error) => {
      const duration = (Date.now() - startTime) / 1000; // Convert to seconds
      const labels = { method, route, status: status.toString() };
      this.requestCounter.inc(labels);
      end(labels);
      this.activeRequests.dec({ method, route });

      if (error) {
        this.errorCounter.inc({ method, route, error_type: error.name });
      }

      this.logger.log(
        `API Request: ${method} ${route} - Status: ${status} - Duration: ${duration.toFixed(3)} seconds`,
      );

      if (error) {
        this.logger.error(
          `API Error: ${method} ${route} - ${error.name}: ${error.message}`,
          error.stack,
        );
      }
    };
  }

  getMetrics() {
    return register.metrics();
  }
}