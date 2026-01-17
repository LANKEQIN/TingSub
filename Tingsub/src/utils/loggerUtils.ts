/**
 * 日志工具
 * 提供统一的日志记录功能
 */

import { ENV } from '../config/env';

/**
 * 日志级别枚举
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * 日志配置
 */
interface LogConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  maxLogSize: number;
  enableTimestamp: boolean;
  enableColors: boolean;
}

/**
 * 日志条目接口
 */
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  context?: string;
}

/**
 * 日志颜色映射
 */
const LOG_COLORS: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: '\x1b[36m', // 青色
  [LogLevel.INFO]: '\x1b[32m', // 绿色
  [LogLevel.WARN]: '\x1b[33m', // 黄色
  [LogLevel.ERROR]: '\x1b[31m', // 红色
};

/**
 * 日志级别优先级
 */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
};

/**
 * 日志工具类
 */
export class Logger {
  private static config: LogConfig = {
    level: ENV.LOG_LEVEL as LogLevel,
    enableConsole: true,
    enableFile: false,
    maxLogSize: 1000,
    enableTimestamp: true,
    enableColors: true,
  };

  private static logHistory: LogEntry[] = [];
  private static context: string = '';

  /**
   * 配置日志
   * @param config 配置对象
   */
  static configure(config: Partial<LogConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 设置上下文
   * @param context 上下文字符串
   */
  static setContext(context: string): void {
    this.context = context;
  }

  /**
   * 清除上下文
   */
  static clearContext(): void {
    this.context = '';
  }

  /**
   * 检查是否应该记录日志
   * @param level 日志级别
   * @returns 是否应该记录
   */
  private static shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.config.level];
  }

  /**
   * 格式化日志消息
   * @param level 日志级别
   * @param message 消息
   * @returns 格式化后的消息
   */
  private static formatMessage(level: LogLevel, message: string): string {
    const parts: string[] = [];

    if (this.config.enableTimestamp) {
      const timestamp = new Date().toISOString();
      parts.push(`[${timestamp}]`);
    }

    if (this.config.enableColors) {
      const color = LOG_COLORS[level];
      const reset = '\x1b[0m';
      parts.push(`${color}[${level.toUpperCase()}]${reset}`);
    } else {
      parts.push(`[${level.toUpperCase()}]`);
    }

    if (this.context) {
      parts.push(`[${this.context}]`);
    }

    parts.push(message);

    return parts.join(' ');
  }

  /**
   * 记录日志
   * @param level 日志级别
   * @param message 消息
   * @param data 数据
   */
  private static log(level: LogLevel, message: string, data?: any): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const formattedMessage = this.formatMessage(level, message);

    if (this.config.enableConsole) {
      switch (level) {
        case LogLevel.DEBUG:
          console.log(formattedMessage, data || '');
          break;
        case LogLevel.INFO:
          console.info(formattedMessage, data || '');
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage, data || '');
          break;
        case LogLevel.ERROR:
          console.error(formattedMessage, data || '');
          break;
      }
    }

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      context: this.context || undefined,
    };

    this.addToHistory(logEntry);
  }

  /**
   * 添加到日志历史
   * @param entry 日志条目
   */
  private static addToHistory(entry: LogEntry): void {
    this.logHistory.push(entry);

    if (this.logHistory.length > this.config.maxLogSize) {
      this.logHistory.shift();
    }
  }

  /**
   * 记录调试日志
   * @param message 消息
   * @param data 数据
   */
  static debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * 记录信息日志
   * @param message 消息
   * @param data 数据
   */
  static info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * 记录警告日志
   * @param message 消息
   * @param data 数据
   */
  static warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * 记录错误日志
   * @param message 消息
   * @param error 错误对象
   */
  static error(message: string, error?: Error | any): void {
    const errorData =
      error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : error;

    this.log(LogLevel.ERROR, message, errorData);
  }

  /**
   * 记录函数调用
   * @param functionName 函数名
   * @param args 参数
   */
  static trace(functionName: string, ...args: any[]): void {
    this.debug(`调用函数: ${functionName}`, args);
  }

  /**
   * 记录性能数据
   * @param operation 操作名称
   * @param duration 持续时间（毫秒）
   */
  static performance(operation: string, duration: number): void {
    this.info(`性能: ${operation} 耗时 ${duration}ms`);
  }

  /**
   * 记录网络请求
   * @param url 请求URL
   * @param method 请求方法
   * @param data 请求数据
   */
  static networkRequest(url: string, method: string, data?: any): void {
    this.debug(`网络请求: ${method} ${url}`, data);
  }

  /**
   * 记录网络响应
   * @param url 请求URL
   * @param status 状态码
   * @param data 响应数据
   */
  static networkResponse(url: string, status: number, data?: any): void {
    this.debug(`网络响应: ${url} ${status}`, data);
  }

  /**
   * 记录网络错误
   * @param url 请求URL
   * @param error 错误信息
   */
  static networkError(url: string, error: Error | string): void {
    this.error(`网络错误: ${url}`, error);
  }

  /**
   * 获取日志历史
   * @param level 日志级别过滤
   * @returns 日志历史
   */
  static getHistory(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logHistory.filter((entry) => entry.level === level);
    }
    return [...this.logHistory];
  }

  /**
   * 清空日志历史
   */
  static clearHistory(): void {
    this.logHistory = [];
  }

  /**
   * 导出日志
   * @returns 日志字符串
   */
  static exportLogs(): string {
    return JSON.stringify(this.logHistory, null, 2);
  }

  /**
   * 创建子日志记录器
   * @param context 上下文
   * @returns 子日志记录器
   */
  static createChild(context: string): ChildLogger {
    return new ChildLogger(context);
  }
}

/**
 * 子日志记录器类
 * 用于创建具有特定上下文的日志记录器
 */
export class ChildLogger {
  constructor(private context: string) {}

  /**
   * 记录调试日志
   * @param message 消息
   * @param data 数据
   */
  debug(message: string, data?: any): void {
    Logger.setContext(this.context);
    Logger.debug(message, data);
    Logger.clearContext();
  }

  /**
   * 记录信息日志
   * @param message 消息
   * @param data 数据
   */
  info(message: string, data?: any): void {
    Logger.setContext(this.context);
    Logger.info(message, data);
    Logger.clearContext();
  }

  /**
   * 记录警告日志
   * @param message 消息
   * @param data 数据
   */
  warn(message: string, data?: any): void {
    Logger.setContext(this.context);
    Logger.warn(message, data);
    Logger.clearContext();
  }

  /**
   * 记录错误日志
   * @param message 消息
   * @param error 错误对象
   */
  error(message: string, error?: Error | any): void {
    Logger.setContext(this.context);
    Logger.error(message, error);
    Logger.clearContext();
  }
}

/**
 * 性能计时器类
 */
export class PerformanceTimer {
  private startTime: number;
  private label: string;

  constructor(label: string) {
    this.label = label;
    this.startTime = Date.now();
  }

  /**
   * 结束计时并记录
   */
  end(): void {
    const duration = Date.now() - this.startTime;
    Logger.performance(this.label, duration);
  }

  /**
   * 获取耗时
   * @returns 耗时（毫秒）
   */
  getDuration(): number {
    return Date.now() - this.startTime;
  }
}

/**
 * 创建性能计时器
 * @param label 标签
 * @returns 性能计时器
 */
export function createTimer(label: string): PerformanceTimer {
  return new PerformanceTimer(label);
}

/**
 * 异步函数包装器，自动记录执行时间
 * @param fn 异步函数
 * @param label 标签
 * @returns 包装后的异步函数
 */
export function withPerformanceLogging<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  label: string
): T {
  return (async (...args: Parameters<T>) => {
    const timer = createTimer(label);
    try {
      const result = await fn(...args);
      timer.end();
      return result;
    } catch (error) {
      timer.end();
      throw error;
    }
  }) as T;
}

/**
 * 错误处理包装器，自动记录错误
 * @param fn 函数
 * @param context 上下文
 * @returns 包装后的函数
 */
export function withErrorLogging<T extends (...args: any[]) => any>(fn: T, context: string): T {
  return ((...args: Parameters<T>) => {
    try {
      return fn(...args);
    } catch (error) {
      Logger.error(`错误 in ${context}`, error instanceof Error ? error : String(error));
      throw error;
    }
  }) as T;
}

/**
 * 异步错误处理包装器
 * @param fn 异步函数
 * @param context 上下文
 * @returns 包装后的异步函数
 */
export function withAsyncErrorLogging<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      Logger.error(`错误 in ${context}`, error instanceof Error ? error : String(error));
      throw error;
    }
  }) as T;
}

/**
 * 日志装饰器
 * 用于装饰类方法，自动记录方法调用
 * @param logLevel 日志级别
 */
export function logMethod(logLevel: LogLevel = LogLevel.DEBUG) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const className = target.constructor.name;
      const methodName = propertyKey;
      const context = `${className}.${methodName}`;

      Logger.setContext(context);

      if (logLevel === LogLevel.DEBUG) {
        Logger.trace(`调用方法: ${methodName}`, args);
      } else {
        Logger.info(`调用方法: ${methodName}`, args);
      }

      try {
        const result = originalMethod.apply(this, args);

        if (result instanceof Promise) {
          return result
            .then((value: any) => {
              Logger.info(`方法完成: ${methodName}`, value);
              Logger.clearContext();
              return value;
            })
            .catch((error: Error) => {
              Logger.error(`方法失败: ${methodName}`, error);
              Logger.clearContext();
              throw error;
            });
        }

        Logger.info(`方法完成: ${methodName}`, result);
        Logger.clearContext();
        return result;
      } catch (error) {
        Logger.error(`方法失败: ${methodName}`, error);
        Logger.clearContext();
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * 默认日志记录器
 */
export const logger = Logger;

/**
 * 创建上下文日志记录器
 * @param context 上下文
 * @returns 上下文日志记录器
 */
export function createLogger(context: string): ChildLogger {
  return Logger.createChild(context);
}
