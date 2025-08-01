import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ResponseLogItem, LoggingConfig } from '../dto/logging.dto';
import { loggingConfig } from '../../config/logging.config';

@Injectable()
export class HttpLoggingService {
  private readonly config: LoggingConfig;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.config = loggingConfig;
  }

  /**
   * 检查是否应该记录请求体
   * @returns 是否记录请求体
   */
  shouldIncludeRequestBody(): boolean {
    return this.config.includeRequestBody;
  }

  /**
   * 记录HTTP响应日志
   * @param logItem 日志数据
   */
  logResponse(logItem: ResponseLogItem): void {
    try {
      // 检查是否应该记录此日志
      if (!this.shouldLog(logItem)) {
        return;
      }

      // 数据脱敏处理
      const sanitizedLogItem = this.sanitizeLogItem(logItem);

      // 根据配置选择输出格式
      const formattedMessage =
        this.config.format === 'json'
          ? this.formatJsonOutput(sanitizedLogItem)
          : this.formatPrettyOutput(sanitizedLogItem);

      // 根据响应状态选择日志级别
      this.outputLog(sanitizedLogItem, formattedMessage);
    } catch (error) {
      this.logger.error('HttpLoggingService记录日志时发生错误:', {
        error: error.message || error,
        stack: error.stack,
      });
    }
  }

  /**
   * 检查是否应该记录此请求的日志
   * @param logItem 日志数据
   * @returns 是否记录
   */
  private shouldLog(logItem: ResponseLogItem): boolean {
    // 检查排除的路由
    if (
      this.config.excludeRoutes.some((route) =>
        logItem.request.path.includes(route),
      )
    ) {
      return false;
    }

    // 检查排除的状态码
    if (this.config.excludeStatusCodes.includes(logItem.response.statusCode)) {
      return false;
    }

    return true;
  }

  /**
   * 数据脱敏处理
   * @param logItem 原始日志数据
   * @returns 脱敏后的日志数据
   */
  private sanitizeLogItem(logItem: ResponseLogItem): ResponseLogItem {
    const sanitized = JSON.parse(JSON.stringify(logItem));

    // 脱敏响应数据
    if (sanitized.response.data) {
      sanitized.response.data = this.sanitizeData(sanitized.response.data);
    }

    // 脱敏请求体
    if (sanitized.request.body) {
      sanitized.request.body = this.sanitizeData(sanitized.request.body);
    }

    // 脱敏请求参数
    if (sanitized.request.params) {
      sanitized.request.params = this.sanitizeData(sanitized.request.params);
    }

    // 脱敏查询参数
    if (sanitized.request.query) {
      sanitized.request.query = this.sanitizeData(sanitized.request.query);
    }

    // 截断数据预览
    if (
      sanitized.response.dataPreview &&
      sanitized.response.dataPreview.length > this.config.truncateAt
    ) {
      sanitized.response.dataPreview =
        sanitized.response.dataPreview.substring(0, this.config.truncateAt) +
        '...';
    }

    return sanitized;
  }

  /**
   * 递归脱敏数据中的敏感字段
   * @param data 数据对象
   * @returns 脱敏后的数据
   */
  private sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeData(item));
    }

    const sanitized = { ...data };
    for (const key in sanitized) {
      // 检查是否为敏感字段
      if (
        this.config.sensitiveFields.some((field) =>
          key.toLowerCase().includes(field.toLowerCase()),
        )
      ) {
        // 保留字段名但隐藏值
        sanitized[key] = '***MASKED***';
      } else if (typeof sanitized[key] === 'object') {
        // 递归处理嵌套对象
        sanitized[key] = this.sanitizeData(sanitized[key]);
      }
      // 非敏感字段保持原值
    }

    return sanitized;
  }

  /**
   * JSON格式输出
   * @param logItem 日志数据
   * @returns JSON字符串
   */
  private formatJsonOutput(logItem: ResponseLogItem): string {
    return JSON.stringify(logItem, null, 2);
  }

  /**
   * 美化格式输出（适合开发环境）
   * @param logItem 日志数据
   * @returns 格式化字符串
   */
  private formatPrettyOutput(logItem: ResponseLogItem): string {
    const { request, response, performance, context, user } = logItem;

    // 状态图标
    const statusIcon =
      response.statusCode >= 500
        ? '🔴'
        : response.statusCode >= 400
          ? '🟡'
          : '🟢';

    // 用户信息
    const userInfo = user
      ? `👤 ${user.email || user.id} ${user.role ? `(${user.role})` : ''} | `
      : '';

    // 主要信息行
    const mainLine = `${statusIcon} [${logItem.timestamp}] ${request.method} ${request.path} [${response.statusCode}] ${performance.duration}ms`;

    // 详细信息行
    const detailLine = `   ${userInfo}📍 ${request.ip} | 🎯 ${context.controller}.${context.handler}`;

    // 参数信息
    const paramsLine =
      Object.keys(request.params).length > 0
        ? `   📝 Params: ${JSON.stringify(request.params)}`
        : '';

    // 查询参数
    const queryLine =
      Object.keys(request.query).length > 0
        ? `   🔍 Query: ${JSON.stringify(request.query)}`
        : '';

    // 请求体信息
    const bodyLine = request.body
      ? `   📤 Body: ${request.bodyPreview || JSON.stringify(request.body)} (${this.formatBytes(request.bodySize || 0)})`
      : '';

    // 响应信息
    const responseLine = `   📊 Response: ${response.dataType} (${this.formatBytes(response.dataSize)})${response.dataPreview ? ` | 💾 ${response.dataPreview}` : ''}`;

    // 错误信息
    const errorLine = logItem.error
      ? `   ❌ Error: ${logItem.error.message}`
      : '';

    return [
      mainLine,
      detailLine,
      paramsLine,
      queryLine,
      bodyLine,
      responseLine,
      errorLine,
    ]
      .filter((line) => line.trim())
      .join('\n');
  }

  /**
   * 根据状态码输出相应级别的日志
   * @param logItem 日志数据
   * @param message 格式化消息
   */
  private outputLog(logItem: ResponseLogItem, message: string): void {
    const statusCode = logItem.response.statusCode;

    // Winston Logger 的元数据
    const logMeta = {
      context: 'HttpLoggingService',
      requestId: logItem.requestId,
      method: logItem.request.method,
      path: logItem.request.path,
      statusCode: logItem.response.statusCode,
      duration: logItem.performance.duration,
      ip: logItem.request.ip,
      userAgent: logItem.request.userAgent,
      ...(logItem.user && { userId: logItem.user.id }),
    };

    if (statusCode >= 500) {
      this.logger.error(message, logMeta);
    } else if (statusCode >= 400) {
      this.logger.warn(message, logMeta);
    } else {
      this.logger.info(message, logMeta);
    }
  }

  /**
   * 格式化字节大小
   * @param bytes 字节数
   * @returns 格式化字符串
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i];
  }

  /**
   * 生成唯一请求ID
   * @returns 请求ID
   */
  static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取数据类型
   * @param data 数据
   * @returns 数据类型字符串
   */
  static getDataType(data: any): string {
    if (data === null) return 'null';
    if (data === undefined) return 'undefined';
    if (Array.isArray(data)) return 'array';
    return typeof data;
  }

  /**
   * 计算数据大小（字节）
   * @param data 数据
   * @returns 字节数
   */
  static getDataSize(data: any): number {
    return Buffer.byteLength(JSON.stringify(data || ''), 'utf8');
  }

  /**
   * 生成数据预览
   * @param data 数据
   * @param length 预览长度
   * @returns 预览字符串
   */
  static generateDataPreview(data: any, length: number = 100): string {
    if (!data) return '';

    const jsonString = JSON.stringify(data);
    return jsonString.length > length
      ? jsonString.substring(0, length) + '...'
      : jsonString;
  }
}
