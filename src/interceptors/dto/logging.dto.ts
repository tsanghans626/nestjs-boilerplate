// HTTP日志相关的类型定义

export interface RequestInfo {
  method: string; // HTTP方法: GET, POST, PUT, DELETE等
  url: string; // 完整请求URL
  path: string; // 路径部分: /api/users/123
  route: string; // 路由模板: /api/users/:id
  params: Record<string, any>; // 路由参数: { id: "123" }
  query: Record<string, any>; // 查询参数: { page: 1, limit: 10 }
  headers?: Record<string, string>; // 关键请求头（可选）
  userAgent?: string; // 用户代理
  ip: string; // 客户端IP
  body?: any; // 请求体数据（可选）
  bodySize?: number; // 请求体大小（字节）
  bodyPreview?: string; // 请求体预览（截断后的字符串）
}

export interface UserInfo {
  id?: string | number; // 用户ID
  email?: string; // 用户邮箱
  role?: string; // 用户角色
}

export interface ResponseInfo {
  statusCode: number; // HTTP状态码: 200, 404, 500等
  statusText: string; // 状态文本: "OK", "Not Found"等
  headers?: Record<string, string>; // 响应头（可选）

  // 数据分析
  dataType: string; // 响应数据类型: "object", "array", "string", "null"
  dataSize: number; // 响应数据大小（字节）
  isSuccess: boolean; // 是否成功响应

  // 响应内容（需要考虑脱敏）
  data?: any; // 实际响应数据
  dataPreview?: string; // 数据预览（截断后的字符串）
}

export interface PerformanceInfo {
  duration: number; // 请求处理时间（毫秒）
  startTime: number; // 开始时间戳
  endTime: number; // 结束时间戳
}

export interface ContextInfo {
  controller: string; // 控制器名称: "UsersController"
  handler: string; // 处理方法名: "findOne"
  module?: string; // 模块名称: "UsersModule"
}

export interface ErrorInfo {
  message: string; // 错误消息
  stack?: string; // 错误堆栈（开发环境）
  code?: string; // 错误代码
}

export interface ResponseLogItem {
  // === 基础信息 ===
  timestamp: string; // ISO时间戳
  requestId: string; // 唯一请求ID（用于链路追踪）

  // === 请求信息 ===
  request: RequestInfo;

  // === 用户信息 ===
  user?: UserInfo;

  // === 响应信息 ===
  response: ResponseInfo;

  // === 性能信息 ===
  performance: PerformanceInfo;

  // === 上下文信息 ===
  context: ContextInfo;

  // === 错误信息（如果有） ===
  error?: ErrorInfo;
}

export interface LoggingConfig {
  // 日志级别
  level: 'debug' | 'info' | 'warn' | 'error';

  // 数据记录选项
  includeRequestBody: boolean; // 是否记录请求体
  includeResponseData: boolean; // 是否记录响应数据
  includeHeaders: boolean; // 是否记录请求/响应头
  includeUserInfo: boolean; // 是否记录用户信息

  // 数据脱敏
  sensitiveFields: string[]; // 敏感字段列表：['password', 'token', 'secret']
  maxDataSize: number; // 最大记录数据大小（字节）
  truncateAt: number; // 数据截断长度

  // 过滤条件
  excludeRoutes: string[]; // 排除的路由：['/health', '/metrics']
  excludeStatusCodes: number[]; // 排除的状态码：[200] (只记录异常)

  // 输出格式
  format: 'json' | 'pretty'; // 日志格式
  colorize: boolean; // 是否着色（控制台输出）
}
