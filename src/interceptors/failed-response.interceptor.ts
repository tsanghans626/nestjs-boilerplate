import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
// 接口异常拦截器
export class HttpFailed implements ExceptionFilter {
  private readonly logger = new Logger(HttpFailed.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    // 处理HTTP异常
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseData = exception.getResponse();
      message =
        typeof responseData === 'string'
          ? responseData
          : (responseData as any).message || exception.message;
    } else {
      // 处理其他类型的异常
      message = (exception as Error)?.message || 'Unknown error';
    }

    // 记录错误日志
    this.logger.error(
      `HTTP Status: ${status} Error Message: ${message}`,
      exception instanceof Error ? exception.stack : 'No stack trace available',
    );

    // 返回统一格式的错误响应
    response.status(status).json({
      code: status,
      msg: message,
      data: {
        path: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
        detail: (exception as any).response?.errors,
      },
      success: false,
    });
  }
}
