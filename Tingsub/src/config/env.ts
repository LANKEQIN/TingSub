// 环境配置文件
// 统一管理应用所有环境变量和配置参数

interface EnvConfig {
  // 应用环境
  NODE_ENV: 'development' | 'production' | 'test';

  // 应用配置
  APP_NAME: string;
  APP_VERSION: string;

  // API配置
  API_BASE_URL: string;
  API_TIMEOUT: number;

  // 数据库配置
  REALM_ENCRYPTION_KEY: string;
  REALM_SCHEMA_VERSION: number;

  // 功能开关
  ENABLE_CLOUD_SYNC: boolean;
  ENABLE_ANALYTICS: boolean;
  ENABLE_CRASH_REPORTING: boolean;

  // 调试配置
  DEBUG_MODE: boolean;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
}

export const ENV: EnvConfig = {
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  APP_NAME: process.env.APP_NAME || '汀阅',
  APP_VERSION: process.env.APP_VERSION || '1.0.0',
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
  API_TIMEOUT: Number(process.env.API_TIMEOUT) || 10000,
  REALM_ENCRYPTION_KEY: process.env.REALM_ENCRYPTION_KEY || 'development-encryption-key',
  REALM_SCHEMA_VERSION: Number(process.env.REALM_SCHEMA_VERSION) || 1,
  ENABLE_CLOUD_SYNC: process.env.ENABLE_CLOUD_SYNC === 'true',
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS === 'true',
  ENABLE_CRASH_REPORTING: process.env.ENABLE_CRASH_REPORTING === 'true',
  DEBUG_MODE: process.env.DEBUG_MODE === 'true' || true,
  LOG_LEVEL: (process.env.LOG_LEVEL as any) || 'debug',
};

// 环境判断工具函数
export const isDevelopment = ENV.NODE_ENV === 'development';
export const isProduction = ENV.NODE_ENV === 'production';
export const isTest = ENV.NODE_ENV === 'test';
