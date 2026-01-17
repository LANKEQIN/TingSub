/**
 * JSON导出器
 * 负责将订阅数据导出为JSON格式
 */

import type { Subscription } from '../../../types/subscription';
import type { Category } from '../../../types/category';
import type { User } from '../../../types/user';
import { Logger } from '../../utils/loggerUtils';
import { format } from 'date-fns';

/**
 * JSON导出配置接口
 */
export interface JSONExportConfig {
  pretty?: boolean;
  dateFormat?: string;
  includeMetadata?: boolean;
}

/**
 * JSON导出结果接口
 */
export interface JSONExportResult {
  success: boolean;
  data?: string;
  filename?: string;
  error?: string;
}

/**
 * JSON导出器类
 */
export class JSONExporter {
  private static instance: JSONExporter;

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): JSONExporter {
    if (!JSONExporter.instance) {
      JSONExporter.instance = new JSONExporter();
    }
    return JSONExporter.instance;
  }

  /**
   * 导出订阅数据为JSON
   */
  async exportSubscriptions(
    subscriptions: Subscription[],
    categories: Category[],
    config: JSONExportConfig = {}
  ): Promise<JSONExportResult> {
    try {
      const { pretty = true, includeMetadata = true } = config;

      if (subscriptions.length === 0) {
        return {
          success: false,
          error: '没有可导出的订阅数据',
        };
      }

      const categoryMap = new Map<string, Category>();
      categories.forEach((category) => {
        categoryMap.set(category.id, category);
      });

      const data = subscriptions.map((subscription) => {
        const category = categoryMap.get(subscription.categoryId);
        return {
          id: subscription.id,
          name: subscription.name,
          description: subscription.description,
          category: category
            ? {
                id: category.id,
                name: category.name,
                color: category.color,
              }
            : null,
          tags: subscription.tags,
          type: subscription.type,
          price: subscription.price,
          currency: subscription.currency,
          billingDate: format(subscription.billingDate, 'yyyy-MM-dd'),
          startDate: format(subscription.startDate, 'yyyy-MM-dd'),
          endDate: subscription.endDate ? format(subscription.endDate, 'yyyy-MM-dd') : null,
          renewalDate: format(subscription.renewalDate, 'yyyy-MM-dd'),
          autoRenew: subscription.autoRenew,
          status: subscription.status,
          platform: subscription.platform,
          paymentMethod: subscription.paymentMethod,
          notes: subscription.notes,
          createdAt: format(subscription.createdAt, 'yyyy-MM-dd HH:mm:ss'),
          updatedAt: format(subscription.updatedAt, 'yyyy-MM-dd HH:mm:ss'),
        };
      });

      const exportData = includeMetadata
        ? {
            metadata: {
              exportDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
              version: '1.0.0',
              count: subscriptions.length,
            },
            data,
          }
        : data;

      const json = pretty ? JSON.stringify(exportData, null, 2) : JSON.stringify(exportData);
      const filename = `subscriptions_${format(new Date(), 'yyyyMMdd_HHmmss')}.json`;

      Logger.info(`成功导出 ${subscriptions.length} 条订阅数据为JSON`);
      return {
        success: true,
        data: json,
        filename,
      };
    } catch (error) {
      Logger.error('导出订阅数据为JSON失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '导出失败',
      };
    }
  }

  /**
   * 导出分类数据为JSON
   */
  async exportCategories(
    categories: Category[],
    config: JSONExportConfig = {}
  ): Promise<JSONExportResult> {
    try {
      const { pretty = true, includeMetadata = true } = config;

      if (categories.length === 0) {
        return {
          success: false,
          error: '没有可导出的分类数据',
        };
      }

      const data = categories.map((category) => ({
        id: category.id,
        userId: category.userId,
        name: category.name,
        description: category.description,
        color: category.color,
        icon: category.icon,
        isDefault: category.isDefault,
        createdAt: format(category.createdAt, 'yyyy-MM-dd HH:mm:ss'),
        updatedAt: format(category.updatedAt, 'yyyy-MM-dd HH:mm:ss'),
      }));

      const exportData = includeMetadata
        ? {
            metadata: {
              exportDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
              version: '1.0.0',
              count: categories.length,
            },
            data,
          }
        : data;

      const json = pretty ? JSON.stringify(exportData, null, 2) : JSON.stringify(exportData);
      const filename = `categories_${format(new Date(), 'yyyyMMdd_HHmmss')}.json`;

      Logger.info(`成功导出 ${categories.length} 条分类数据为JSON`);
      return {
        success: true,
        data: json,
        filename,
      };
    } catch (error) {
      Logger.error('导出分类数据为JSON失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '导出失败',
      };
    }
  }

  /**
   * 导出用户数据为JSON
   */
  async exportUser(user: User, config: JSONExportConfig = {}): Promise<JSONExportResult> {
    try {
      const { pretty = true, includeMetadata = true } = config;

      const data = {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        theme: user.theme,
        currency: user.currency,
        reminderSettings: {
          enabled: user.reminderSettings.enabled,
          advanceDays: user.reminderSettings.advanceDays,
          repeatInterval: user.reminderSettings.repeatInterval,
          notificationChannels: user.reminderSettings.notificationChannels,
        },
        createdAt: format(user.createdAt, 'yyyy-MM-dd HH:mm:ss'),
        updatedAt: format(user.updatedAt, 'yyyy-MM-dd HH:mm:ss'),
      };

      const exportData = includeMetadata
        ? {
            metadata: {
              exportDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
              version: '1.0.0',
            },
            data,
          }
        : data;

      const json = pretty ? JSON.stringify(exportData, null, 2) : JSON.stringify(exportData);
      const filename = `user_${format(new Date(), 'yyyyMMdd_HHmmss')}.json`;

      Logger.info('成功导出用户数据为JSON');
      return {
        success: true,
        data: json,
        filename,
      };
    } catch (error) {
      Logger.error('导出用户数据为JSON失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '导出失败',
      };
    }
  }

  /**
   * 导出统计摘要为JSON
   */
  async exportStats(
    stats: {
      totalSubscriptions: number;
      activeSubscriptions: number;
      cancelledSubscriptions: number;
      expiredSubscriptions: number;
      totalMonthlyExpense: number;
      totalYearlyExpense: number;
      upcomingRenewals: number;
      expiringSoon: number;
    },
    config: JSONExportConfig = {}
  ): Promise<JSONExportResult> {
    try {
      const { pretty = true, includeMetadata = true } = config;

      const data = {
        totalSubscriptions: stats.totalSubscriptions,
        activeSubscriptions: stats.activeSubscriptions,
        cancelledSubscriptions: stats.cancelledSubscriptions,
        expiredSubscriptions: stats.expiredSubscriptions,
        totalMonthlyExpense: stats.totalMonthlyExpense,
        totalYearlyExpense: stats.totalYearlyExpense,
        upcomingRenewals: stats.upcomingRenewals,
        expiringSoon: stats.expiringSoon,
      };

      const exportData = includeMetadata
        ? {
            metadata: {
              exportDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
              version: '1.0.0',
            },
            data,
          }
        : data;

      const json = pretty ? JSON.stringify(exportData, null, 2) : JSON.stringify(exportData);
      const filename = `stats_${format(new Date(), 'yyyyMMdd_HHmmss')}.json`;

      Logger.info('成功导出统计摘要为JSON');
      return {
        success: true,
        data: json,
        filename,
      };
    } catch (error) {
      Logger.error('导出统计摘要为JSON失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '导出失败',
      };
    }
  }

  /**
   * 导出完整数据为JSON（包含用户、订阅、分类）
   */
  async exportFullData(
    user: User,
    subscriptions: Subscription[],
    categories: Category[],
    config: JSONExportConfig = {}
  ): Promise<JSONExportResult> {
    try {
      const { pretty = true } = config;

      const categoryMap = new Map<string, Category>();
      categories.forEach((category) => {
        categoryMap.set(category.id, category);
      });

      const exportData = {
        metadata: {
          exportDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          version: '1.0.0',
          app: '汀阅',
        },
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          theme: user.theme,
          currency: user.currency,
          reminderSettings: user.reminderSettings,
          createdAt: format(user.createdAt, 'yyyy-MM-dd HH:mm:ss'),
          updatedAt: format(user.updatedAt, 'yyyy-MM-dd HH:mm:ss'),
        },
        categories: categories.map((category) => ({
          id: category.id,
          name: category.name,
          description: category.description,
          color: category.color,
          icon: category.icon,
          isDefault: category.isDefault,
        })),
        subscriptions: subscriptions.map((subscription) => {
          const category = categoryMap.get(subscription.categoryId);
          return {
            id: subscription.id,
            name: subscription.name,
            description: subscription.description,
            categoryId: subscription.categoryId,
            categoryName: category?.name,
            tags: subscription.tags,
            type: subscription.type,
            price: subscription.price,
            currency: subscription.currency,
            billingDate: format(subscription.billingDate, 'yyyy-MM-dd'),
            startDate: format(subscription.startDate, 'yyyy-MM-dd'),
            endDate: subscription.endDate ? format(subscription.endDate, 'yyyy-MM-dd') : null,
            renewalDate: format(subscription.renewalDate, 'yyyy-MM-dd'),
            autoRenew: subscription.autoRenew,
            status: subscription.status,
            platform: subscription.platform,
            paymentMethod: subscription.paymentMethod,
            notes: subscription.notes,
            createdAt: format(subscription.createdAt, 'yyyy-MM-dd HH:mm:ss'),
            updatedAt: format(subscription.updatedAt, 'yyyy-MM-dd HH:mm:ss'),
          };
        }),
      };

      const json = pretty ? JSON.stringify(exportData, null, 2) : JSON.stringify(exportData);
      const filename = `tingsub_backup_${format(new Date(), 'yyyyMMdd_HHmmss')}.json`;

      Logger.info('成功导出完整数据为JSON');
      return {
        success: true,
        data: json,
        filename,
      };
    } catch (error) {
      Logger.error('导出完整数据为JSON失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '导出失败',
      };
    }
  }

  /**
   * 从JSON导入数据
   */
  async importData(jsonString: string): Promise<{
    success: boolean;
    user?: User;
    subscriptions?: Subscription[];
    categories?: Category[];
    error?: string;
  }> {
    try {
      const data = JSON.parse(jsonString);

      if (!data || typeof data !== 'object') {
        return {
          success: false,
          error: '无效的JSON数据',
        };
      }

      const result: any = {
        success: true,
      };

      if (data.user) {
        result.user = data.user;
      }

      if (data.subscriptions) {
        result.subscriptions = data.subscriptions;
      }

      if (data.categories) {
        result.categories = data.categories;
      }

      Logger.info('成功从JSON导入数据');
      return result;
    } catch (error) {
      Logger.error('从JSON导入数据失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '导入失败',
      };
    }
  }
}

/**
 * 导出单例实例
 */
export const jsonExporter = JSONExporter.getInstance();
