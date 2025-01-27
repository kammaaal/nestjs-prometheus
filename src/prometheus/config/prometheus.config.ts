import { registerAs } from '@nestjs/config';
import { envToBoolean } from '../../util/env-to-boolean.util';

export const PROMETHEUS_CONFIG_KEY = 'prometheus-config';

export default registerAs(PROMETHEUS_CONFIG_KEY, () => ({
  enableDefaultMetrics: envToBoolean(
    'PROMETHEUS_DEFAULT_METRICS_ENABLED',
    true,
  ),
  enableHttpMetrics: envToBoolean('PROMETHEUS_HTTP_METRICS_ENABLED', true),
  httpDurationBuckets: [0.05, 0.1, 0.3, 0.7, 1, 2, 5, 10],
}));
