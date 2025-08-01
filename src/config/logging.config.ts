import { LoggingConfig } from '../interceptors/dto/logging.dto';

export const loggingConfig: LoggingConfig = {
  // 日志级别 - 开发环境使用debug，生产环境使用info
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

  // 数据记录选项
  includeRequestBody: true, // 记录请求体
  includeResponseData: true, // 记录响应数据
  includeHeaders: false, // 暂时不记录头信息，避免过多日志
  includeUserInfo: true, // 记录用户信息

  // 数据脱敏配置
  sensitiveFields: [
    'password',
    'token',
    'secret',
    'authorization',
    'cookie',
    'session',
    'plain_token',
    'signature',
    'access_token',
    'refresh_token',
    'api_key',
    'private_key',
  ],
  maxDataSize: 10240, // 最大10KB
  truncateAt: 500, // 超过500字符截断

  // 过滤条件
  excludeRoutes: [
    '/health', // 健康检查
    '/metrics', // 监控指标
    '/favicon.ico', // 图标请求
    '/api/health', // API健康检查
  ],
  excludeStatusCodes: [], // 不排除任何状态码，记录所有响应

  // 输出格式
  format: process.env.NODE_ENV === 'production' ? 'json' : 'pretty',
  colorize: process.env.NODE_ENV !== 'production', // 开发环境启用颜色
};
