/**
 * CSV导出器
 * 负责将订阅数据导出为CSV格式
 */

import type { Subscription } from '../../../types/subscription';
import type { Category } from '../../../types/category';
import type { User } from '../../../types/user';
import { Logger } from '../../utils/loggerUtils';
import { format } from 'date-fns';

/**
 * CSV导出配置接口
 */
export interface CSVExportConfig {
  includeHeaders?: boolean;
  delimiter?: string;
  dateFormat?: string;
  encoding?: 'utf-8' | 'gbk';
}

/**
 * CSV导出结果接口
 */
export interface CSVExportResult {
  success: boolean;
  data?: string;
  filename?: string;
  error?: string;
}

/**
 * CSV导出器类
 */
export class CSVExporter {
  private static instance: CSVExporter;

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): CSVExporter {
    if (!CSVExporter.instance) {
      CSVExporter.instance = new CSVExporter();
    }
    return CSVExporter.instance;
  }

  /**
   * 导出订阅数据为CSV
   */
  async exportSubscriptions(
    subscriptions: Subscription[],
    categories: Category[],
    config: CSVExportConfig = {}
  ): Promise<CSVExportResult> {
    try {
      const { includeHeaders = true, delimiter = ',', dateFormat = 'yyyy-MM-dd' } = config;

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

      const headers = [
        '订阅ID',
        '订阅名称',
        '描述',
        '分类',
        '标签',
        '订阅周期',
        '价格',
        '货币',
        '计费日期',
        '开始日期',
        '结束日期',
        '续费日期',
        '自动续费',
        '状态',
        '平台',
        '支付方式',
        '备注',
        '创建时间',
        '更新时间',
      ];

      const rows = subscriptions.map((subscription) => {
        const category = categoryMap.get(subscription.categoryId);
        return [
          subscription.id,
          this.escapeCSVField(subscription.name),
          this.escapeCSVField(subscription.description || ''),
          this.escapeCSVField(category?.name || ''),
          this.escapeCSVField(subscription.tags.join('; ')),
          this.translateSubscriptionType(subscription.type),
          subscription.price.toFixed(2),
          subscription.currency,
          format(subscription.billingDate, dateFormat),
          format(subscription.startDate, dateFormat),
          subscription.endDate ? format(subscription.endDate, dateFormat) : '',
          format(subscription.renewalDate, dateFormat),
          subscription.autoRenew ? '是' : '否',
          this.translateSubscriptionStatus(subscription.status),
          this.escapeCSVField(subscription.platform),
          this.escapeCSVField(subscription.paymentMethod),
          this.escapeCSVField(subscription.notes || ''),
          format(subscription.createdAt, dateFormat),
          format(subscription.updatedAt, dateFormat),
        ].join(delimiter);
      });

      let csv = '';
      if (includeHeaders) {
        csv += headers.join(delimiter) + '\n';
      }
      csv += rows.join('\n');

      const filename = `subscriptions_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;

      Logger.info(`成功导出 ${subscriptions.length} 条订阅数据为CSV`);
      return {
        success: true,
        data: csv,
        filename,
      };
    } catch (error) {
      Logger.error('导出订阅数据为CSV失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '导出失败',
      };
    }
  }

  /**
   * 导出分类数据为CSV
   */
  async exportCategories(
    categories: Category[],
    config: CSVExportConfig = {}
  ): Promise<CSVExportResult> {
    try {
      const { includeHeaders = true, delimiter = ',', dateFormat = 'yyyy-MM-dd' } = config;

      if (categories.length === 0) {
        return {
          success: false,
          error: '没有可导出的分类数据',
        };
      }

      const headers = [
        '分类ID',
        '用户ID',
        '分类名称',
        '描述',
        '颜色',
        '图标',
        '是否默认',
        '创建时间',
        '更新时间',
      ];

      const rows = categories.map((category) => {
        return [
          category.id,
          category.userId,
          this.escapeCSVField(category.name),
          this.escapeCSVField(category.description || ''),
          category.color,
          category.icon,
          category.isDefault ? '是' : '否',
          format(category.createdAt, dateFormat),
          format(category.updatedAt, dateFormat),
        ].join(delimiter);
      });

      let csv = '';
      if (includeHeaders) {
        csv += headers.join(delimiter) + '\n';
      }
      csv += rows.join('\n');

      const filename = `categories_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;

      Logger.info(`成功导出 ${categories.length} 条分类数据为CSV`);
      return {
        success: true,
        data: csv,
        filename,
      };
    } catch (error) {
      Logger.error('导出分类数据为CSV失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '导出失败',
      };
    }
  }

  /**
   * 导出用户数据为CSV
   */
  async exportUser(user: User, config: CSVExportConfig = {}): Promise<CSVExportResult> {
    try {
      const { includeHeaders = true, delimiter = ',', dateFormat = 'yyyy-MM-dd' } = config;

      const headers = [
        '用户ID',
        '用户名',
        '邮箱',
        '头像',
        '主题',
        '货币',
        '提醒启用',
        '提前天数',
        '重复间隔',
        '通知渠道',
        '创建时间',
        '更新时间',
      ];

      const notificationChannels = user.reminderSettings.notificationChannels
        .map((channel) => {
          const parts: string[] = [channel.type];
          if (channel.enabled) parts.push('启用');
          if (channel.sound) parts.push('声音');
          if (channel.vibration) parts.push('震动');
          return parts.join('-');
        })
        .join('; ');

      const row = [
        user.id,
        this.escapeCSVField(user.username),
        this.escapeCSVField(user.email || ''),
        this.escapeCSVField(user.avatar || ''),
        this.translateTheme(user.theme),
        user.currency,
        user.reminderSettings.enabled ? '是' : '否',
        user.reminderSettings.advanceDays,
        this.translateRepeatInterval(user.reminderSettings.repeatInterval),
        this.escapeCSVField(notificationChannels),
        format(user.createdAt, dateFormat),
        format(user.updatedAt, dateFormat),
      ].join(delimiter);

      let csv = '';
      if (includeHeaders) {
        csv += headers.join(delimiter) + '\n';
      }
      csv += row;

      const filename = `user_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;

      Logger.info('成功导出用户数据为CSV');
      return {
        success: true,
        data: csv,
        filename,
      };
    } catch (error) {
      Logger.error('导出用户数据为CSV失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '导出失败',
      };
    }
  }

  /**
   * 导出统计摘要为CSV
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
    config: CSVExportConfig = {}
  ): Promise<CSVExportResult> {
    try {
      const { includeHeaders = true, delimiter = ',' } = config;

      const headers = ['统计项', '数值'];
      const rows = [
        ['总订阅数', stats.totalSubscriptions],
        ['活跃订阅数', stats.activeSubscriptions],
        ['已取消订阅数', stats.cancelledSubscriptions],
        ['已过期订阅数', stats.expiredSubscriptions],
        ['月度总支出', stats.totalMonthlyExpense.toFixed(2)],
        ['年度总支出', stats.totalYearlyExpense.toFixed(2)],
        ['即将续费数', stats.upcomingRenewals],
        ['即将到期数', stats.expiringSoon],
      ];

      let csv = '';
      if (includeHeaders) {
        csv += headers.join(delimiter) + '\n';
      }
      csv += rows.map((row) => row.join(delimiter)).join('\n');

      const filename = `stats_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;

      Logger.info('成功导出统计摘要为CSV');
      return {
        success: true,
        data: csv,
        filename,
      };
    } catch (error) {
      Logger.error('导出统计摘要为CSV失败', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '导出失败',
      };
    }
  }

  /**
   * 转义CSV字段
   */
  private escapeCSVField(field: string): string {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }

  /**
   * 翻译订阅周期类型
   */
  private translateSubscriptionType(type: string): string {
    const typeMap: Record<string, string> = {
      weekly: '每周',
      monthly: '每月',
      quarterly: '每季度',
      yearly: '每年',
      'one-time': '一次性',
    };
    return typeMap[type] || type;
  }

  /**
   * 翻译订阅状态
   */
  private translateSubscriptionStatus(status: string): string {
    const statusMap: Record<string, string> = {
      active: '活跃',
      cancelled: '已取消',
      expired: '已过期',
    };
    return statusMap[status] || status;
  }

  /**
   * 翻译主题
   */
  private translateTheme(theme: string): string {
    const themeMap: Record<string, string> = {
      light: '浅色',
      dark: '深色',
      system: '跟随系统',
    };
    return themeMap[theme] || theme;
  }

  /**
   * 翻译重复间隔
   */
  private translateRepeatInterval(interval: string): string {
    const intervalMap: Record<string, string> = {
      none: '不重复',
      daily: '每天',
      weekly: '每周',
    };
    return intervalMap[interval] || interval;
  }
}

/**
 * 导出单例实例
 */
export const csvExporter = CSVExporter.getInstance();
