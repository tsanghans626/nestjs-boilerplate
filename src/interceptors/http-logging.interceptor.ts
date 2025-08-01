import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { HttpLoggingService } from './services/http-logging.service';
import {
  ResponseLogItem,
  RequestInfo,
  ResponseInfo,
  PerformanceInfo,
  ContextInfo,
  UserInfo,
  ErrorInfo,
} from './dto/logging.dto';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly httpLoggingService: HttpLoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const requestId = HttpLoggingService.generateRequestId();

    // 提取基础信息
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // 构建请求信息
    const requestInfo = this.buildRequestInfo(request);

    // 构建上下文信息
    const contextInfo = this.buildContextInfo(context);

    // 提取用户信息
    const userInfo = this.extractUserInfo(request);

    return next.handle().pipe(
      // 成功响应处理
      tap((responseData) => {
        const endTime = Date.now();

        // 在tap阶段设置通用响应头
        if (!response.getHeader('content-type')) {
          response.setHeader('content-type', 'application/json; charset=utf-8');
        }

        const responseInfo = this.buildResponseInfo(
          response,
          responseData,
          true,
        );
        const performanceInfo = this.buildPerformanceInfo(startTime, endTime);

        const logItem: ResponseLogItem = {
          timestamp: new Date().toISOString(),
          requestId,
          request: requestInfo,
          user: userInfo,
          response: responseInfo,
          performance: performanceInfo,
          context: contextInfo,
        };

        this.httpLoggingService.logResponse(logItem);
      }),

      // 错误响应处理
      catchError((error) => {
        const endTime = Date.now();
        const statusCode = error?.status || error?.statusCode || 500;
        const responseInfo = this.buildResponseInfo(
          response,
          error,
          false,
          statusCode,
        );
        const performanceInfo = this.buildPerformanceInfo(startTime, endTime);
        const errorInfo = this.buildErrorInfo(error);

        const logItem: ResponseLogItem = {
          timestamp: new Date().toISOString(),
          requestId,
          request: requestInfo,
          user: userInfo,
          response: responseInfo,
          performance: performanceInfo,
          context: contextInfo,
          error: errorInfo,
        };

        this.httpLoggingService.logResponse(logItem);

        // 重新抛出错误，不影响原有错误处理流程
        return throwError(() => error);
      }),
    );
  }

  /**
   * 构建请求信息
   */
  private buildRequestInfo(request: Request): RequestInfo {
    // 获取客户端真实IP
    const getClientIp = (req: Request): string => {
      return (
        (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
        (req.headers['x-real-ip'] as string) ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.ip ||
        'unknown'
      );
    };

    // 构建完整URL
    const protocol = request.protocol || 'http';
    const host = request.get('host') || 'localhost';
    const fullUrl = `${protocol}://${host}${request.originalUrl || request.url}`;

    // 构建请求体信息
    const requestBody = this.httpLoggingService.shouldIncludeRequestBody()
      ? request.body
      : undefined;
    const bodySize = requestBody
      ? HttpLoggingService.getDataSize(requestBody)
      : 0;
    const bodyPreview = requestBody
      ? HttpLoggingService.generateDataPreview(requestBody, 200)
      : undefined;

    return {
      method: request.method,
      url: fullUrl,
      path: request.path || request.url,
      route: request.route?.path || request.path || request.url,
      params: request.params || {},
      query: request.query || {},
      headers: this.extractImportantHeaders(request.headers),
      userAgent: request.get('user-agent'),
      ip: getClientIp(request),
      body: requestBody,
      bodySize,
      bodyPreview,
    };
  }

  /**
   * 提取重要的请求头
   */
  private extractImportantHeaders(headers: any): Record<string, string> {
    const importantHeaders = [
      'content-type',
      'accept',
      'authorization',
      'x-forwarded-for',
      'x-real-ip',
      'x-bot-appid',
    ];

    const result: Record<string, string> = {};
    importantHeaders.forEach((header) => {
      if (headers[header]) {
        // 对authorization进行脱敏处理
        if (header === 'authorization') {
          result[header] = '***MASKED***';
        } else {
          result[header] = headers[header];
        }
      }
    });

    return result;
  }

  /**
   * 提取重要的响应头
   */
  private extractImportantResponseHeaders(
    response: Response,
  ): Record<string, string> {
    const importantResponseHeaders = [
      'content-type',
      'content-length',
      'cache-control',
      'location',
      'set-cookie',
    ];

    const result: Record<string, string> = {};

    // 尝试多种方式获取响应头
    importantResponseHeaders.forEach((header) => {
      let value: string | undefined;

      // 方法1: 使用 response.get()
      try {
        value = response.get(header);
      } catch {
        // 忽略错误，尝试其他方法
      }

      // 方法2: 使用 response.getHeader()
      if (!value && typeof response.getHeader === 'function') {
        try {
          const headerValue = response.getHeader(header);
          value = Array.isArray(headerValue)
            ? headerValue.join(', ')
            : String(headerValue);
        } catch {
          // 忽略错误
        }
      }

      // 方法3: 直接访问 headers 属性
      if (!value && (response as any).headers) {
        value = (response as any).headers[header];
      }

      if (value && value !== 'undefined') {
        // 对set-cookie进行脱敏处理
        if (header === 'set-cookie') {
          result[header] = '***MASKED***';
        } else {
          result[header] = value;
        }
      }
    });

    // 特殊处理：根据响应数据推断content-type
    if (!result['content-type']) {
      // 如果响应头中没有content-type，尝试根据响应对象推断
      result['content-type'] = 'application/json; charset=utf-8';
    }

    return result;
  }

  /**
   * 构建响应信息
   */
  private buildResponseInfo(
    response: Response,
    responseData: any,
    isSuccess: boolean,
    statusCode?: number,
  ): ResponseInfo {
    const actualStatusCode = statusCode || response.statusCode || 200;

    // 获取状态文本
    const getStatusText = (code: number): string => {
      const statusTexts: Record<number, string> = {
        200: 'OK',
        201: 'Created',
        202: 'Accepted',
        204: 'No Content',
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
      };
      return statusTexts[code] || 'Unknown';
    };

    const dataType = HttpLoggingService.getDataType(responseData);
    const dataSize = HttpLoggingService.getDataSize(responseData);
    const dataPreview = HttpLoggingService.generateDataPreview(
      responseData,
      100,
    );

    // 提取重要的响应头
    const responseHeaders = this.extractImportantResponseHeaders(response);

    return {
      statusCode: actualStatusCode,
      statusText: getStatusText(actualStatusCode),
      headers: responseHeaders,
      dataType,
      dataSize,
      isSuccess,
      data: responseData,
      dataPreview,
    };
  }

  /**
   * 构建性能信息
   */
  private buildPerformanceInfo(
    startTime: number,
    endTime: number,
  ): PerformanceInfo {
    return {
      duration: endTime - startTime,
      startTime,
      endTime,
    };
  }

  /**
   * 构建上下文信息
   */
  private buildContextInfo(context: ExecutionContext): ContextInfo {
    const controllerClass = context.getClass();
    const handlerMethod = context.getHandler();

    return {
      controller: controllerClass.name,
      handler: handlerMethod.name,
      module: this.extractModuleName(controllerClass.name),
    };
  }

  /**
   * 从控制器名称推断模块名称
   */
  private extractModuleName(controllerName: string): string {
    // UsersController -> UsersModule
    // AuthController -> AuthModule
    if (controllerName.endsWith('Controller')) {
      const baseName = controllerName.replace('Controller', '');
      return `${baseName}Module`;
    }
    return controllerName;
  }

  /**
   * 提取用户信息（从JWT认证或session中）
   */
  private extractUserInfo(request: Request): UserInfo | undefined {
    // 检查request.user（通常由JWT策略设置）
    const user = (request as any).user;

    if (!user) {
      return undefined;
    }

    // 根据实际项目中的用户对象结构调整
    return {
      id: user.id || user.userId || user.sub,
      email: user.email,
      role: user.role || user.roles?.[0],
    };
  }

  /**
   * 构建错误信息
   */
  private buildErrorInfo(error: any): ErrorInfo {
    return {
      message: error?.message || 'Unknown error',
      stack: process.env.NODE_ENV !== 'production' ? error?.stack : undefined,
      code: error?.code || error?.name,
    };
  }
}
