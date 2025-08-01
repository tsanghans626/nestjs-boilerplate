import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';

interface Data<T> {
  data: T;
}

// 创建装饰器用于跳过响应包装
export const SKIP_RESPONSE_WRAP_KEY = 'skipResponseWrap';
export const SkipResponseWrap = () => SetMetadata(SKIP_RESPONSE_WRAP_KEY, true);

@Injectable()
export class SuccessResponseInterceptor<T> implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Data<T> | T> {
    const skipWrap = this.reflector.getAllAndOverride<boolean>(
      SKIP_RESPONSE_WRAP_KEY,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      map((data) => {
        if (skipWrap) {
          return data; // 直接返回原始数据，不包装
        }

        return {
          code: '0000',
          msg: '请求成功',
          data, // data即为 Service层或者Controller层的返回值
          success: true,
        };
      }),
    );
  }
}
