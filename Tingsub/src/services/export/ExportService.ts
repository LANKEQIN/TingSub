/**
 * 导出服务
 * 负责统一管理数据导出功能
 */

import type { Subscription } from '../../../types/subscription';
import type { Category } from '../../../types/category';
import type { User } from '../../../types/user';
import { csvExporter, CSVExportConfig } from './csvExporter';
import { jsonExporter, JSONExportConfig } from './jsonExporter';
import { Logger } from '../../utils/loggerUtils';

/**
 * 导出格式类型
 */
export type ExportFormat = 'csv' | 'json';

/**
 * 导出类型
 */
export type ExportType = 'subscriptions' | 'categories' | 'user' | 'stats' | 'full';

/**
 * 导出配置接口
 */
export interface ExportConfig {
  format: ExportFormat;
  type: ExportType;
  csvConfig?: CSVExportConfig;
  jsonConfig?: JSONExportConfig;
}

/**
 * 导出结果接口
 */
export interface ExportResult {
  success: boolean;
  data?: string;
  filename?: string;
  format?: ExportFormat;
  type?: ExportType;
  error?: string;
}

/**
 * 统计数据接口
 */
export interface StatsData {
  totalSubscriptions: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  expiredSubscriptions: number;
  totalMonthlyExpense: number;
  totalYearlyExpense: number;
  upcomingRenewals: number;
  expiringSoon: number;
}

/**
 * 导出服务类
 */
export class ExportService {
  private static instance: ExportService;

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  /**
   * 导出数据
   */
  async export(
    config: ExportConfig,
    data: {
      user?: User;
      subscriptions?: Subscription[];
      categories?: Category[];
      stats?: StatsData;
    }
  ): Promise<ExportResult> {
    try {
      const { format, type, csvConfig, jsonConfig } = config;

      switch (type) {
        case 'subscriptions':
          return this.exportSubscriptions(
            format,
            data.subscriptions || [],
            data.categories || [],
            csvConfig,
            jsonConfig
          );

        case 'categories':
          return this.exportCategories(format, data.categories || [], csvConfig, jsonConfig);

        case 'user':
          return this.exportUser(format, data.user, csvConfig, jsonConfig);

        case 'stats':
          return this.exportStats(format, data.stats, csvConfig, jsonConfig);

        case 'full':
          return this.exportFullData(
            format,
            data.user,
            data.subscriptions || [],
            data.categories || [],
            jsonConfig
          );

        default:
          return {
            success: false,
            error: '不支持的导出类型',
          };
      }
    } catch (error) {
      Logger.error('导出数据失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '导出失败',
      };
    }
  }

  /**
   * 导出订阅数据
   */
  private async exportSubscriptions(
    format: ExportFormat,
    subscriptions: Subscription[],
    categories: Category[],
    csvConfig?: CSVExportConfig,
    jsonConfig?: JSONExportConfig
  ): Promise<ExportResult> {
    if (format === 'csv') {
      const result = await csvExporter.exportSubscriptions(subscriptions, categories, csvConfig);
      return {
        ...result,
        format: 'csv',
        type: 'subscriptions',
      };
    } else {
      const result = await jsonExporter.exportSubscriptions(subscriptions, categories, jsonConfig);
      return {
        ...result,
        format: 'json',
        type: 'subscriptions',
      };
    }
  }

  /**
   * 导出分类数据
   */
  private async exportCategories(
    format: ExportFormat,
    categories: Category[],
    csvConfig?: CSVExportConfig,
    jsonConfig?: JSONExportConfig
  ): Promise<ExportResult> {
    if (format === 'csv') {
      const result = await csvExporter.exportCategories(categories, csvConfig);
      return {
        ...result,
        format: 'csv',
        type: 'categories',
      };
    } else {
      const result = await jsonExporter.exportCategories(categories, jsonConfig);
      return {
        ...result,
        format: 'json',
        type: 'categories',
      };
    }
  }

  /**
   * 导出用户数据
   */
  private async exportUser(
    format: ExportFormat,
    user?: User,
    csvConfig?: CSVExportConfig,
    jsonConfig?: JSONExportConfig
  ): Promise<ExportResult> {
    if (!user) {
      return {
        success: false,
        error: '用户数据不存在',
      };
    }

    if (format === 'csv') {
      const result = await csvExporter.exportUser(user, csvConfig);
      return {
        ...result,
        format: 'csv',
        type: 'user',
      };
    } else {
      const result = await jsonExporter.exportUser(user, jsonConfig);
      return {
        ...result,
        format: 'json',
        type: 'user',
      };
    }
  }

  /**
   * 导出统计数据
   */
  private async exportStats(
    format: ExportFormat,
    stats?: StatsData,
    csvConfig?: CSVExportConfig,
    jsonConfig?: JSONExportConfig
  ): Promise<ExportResult> {
    if (!stats) {
      return {
        success: false,
        error: '统计数据不存在',
      };
    }

    if (format === 'csv') {
      const result = await csvExporter.exportStats(stats, csvConfig);
      return {
        ...result,
        format: 'csv',
        type: 'stats',
      };
    } else {
      const result = await jsonExporter.exportStats(stats, jsonConfig);
      return {
        ...result,
        format: 'json',
        type: 'stats',
      };
    }
  }

  /**
   * 导出完整数据
   */
  private async exportFullData(
    format: ExportFormat,
    user?: User,
    subscriptions?: Subscription[],
    categories?: Category[],
    jsonConfig?: JSONExportConfig
  ): Promise<ExportResult> {
    if (!user) {
      return {
        success: false,
        error: '用户数据不存在',
      };
    }

    if (format !== 'json') {
      return {
        success: false,
        error: '完整数据导出仅支持JSON格式',
      };
    }

    const result = await jsonExporter.exportFullData(
      user,
      subscriptions || [],
      categories || [],
      jsonConfig
    );

    return {
      ...result,
      format: 'json',
      type: 'full',
    };
  }

  /**
   * 批量导出多种格式
   */
  async exportMultipleFormats(
    type: ExportType,
    data: {
      user?: User;
      subscriptions?: Subscription[];
      categories?: Category[];
      stats?: StatsData;
    },
    formats: ExportFormat[] = ['csv', 'json']
  ): Promise<ExportResult[]> {
    const results: ExportResult[] = [];

    for (const format of formats) {
      const result = await this.export(
        {
          format,
          type,
        },
        data
      );
      results.push(result);
    }

    return results;
  }

  /**
   * 从JSON导入数据
   */
  async importFromJSON(jsonString: string): Promise<{
    success: boolean;
    user?: User;
    subscriptions?: Subscription[];
    categories?: Category[];
    error?: string;
  }> {
    return jsonExporter.importData(jsonString);
  }

  /**
   * 验证导出数据
   */
  validateExportData(
    type: ExportType,
    data: {
      user?: User;
      subscriptions?: Subscription[];
      categories?: Category[];
      stats?: StatsData;
    }
  ): { valid: boolean; error?: string } {
    switch (type) {
      case 'subscriptions':
        if (!data.subscriptions || data.subscriptions.length === 0) {
          return { valid: false, error: '没有可导出的订阅数据' };
        }
        if (!data.categories || data.categories.length === 0) {
          return { valid: false, error: '缺少分类数据' };
        }
        break;

      case 'categories':
        if (!data.categories || data.categories.length === 0) {
          return { valid: false, error: '没有可导出的分类数据' };
        }
        break;

      case 'user':
        if (!data.user) {
          return { valid: false, error: '用户数据不存在' };
        }
        break;

      case 'stats':
        if (!data.stats) {
          return { valid: false, error: '统计数据不存在' };
        }
        break;

      case 'full':
        if (!data.user) {
          return { valid: false, error: '用户数据不存在' };
        }
        if (!data.subscriptions || data.subscriptions.length === 0) {
          return { valid: false, error: '没有可导出的订阅数据' };
        }
        if (!data.categories || data.categories.length === 0) {
          return { valid: false, error: '没有可导出的分类数据' };
        }
        break;
    }

    return { valid: true };
  }

  /**
   * 获取支持的导出格式
   */
  getSupportedFormats(): ExportFormat[] {
    return ['csv', 'json'];
  }

  /**
   * 获取支持的导出类型
   */
  getSupportedTypes(): ExportType[] {
    return ['subscriptions', 'categories', 'user', 'stats', 'full'];
  }

  /**
   * 检查格式是否支持指定类型
   */
  isFormatSupportedForType(format: ExportFormat, type: ExportType): boolean {
    if (type === 'full') {
      return format === 'json';
    }
    return true;
  }
}

/**
 * 导出单例实例
 */
export const exportService = ExportService.getInstance();
