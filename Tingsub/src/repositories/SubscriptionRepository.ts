/**
 * 订阅仓储类
 * 提供订阅数据访问操作
 */

import Realm from 'realm';
import { BaseRepository } from './BaseRepository';
import { SubscriptionModel } from '../models/Subscription';
import { ValidationUtils } from '../utils/validationUtils';
import { Logger } from '../utils/loggerUtils';
import type {
  Subscription,
  CreateSubscriptionParams,
  UpdateSubscriptionParams,
  SubscriptionQueryParams,
  SubscriptionStats,
} from '../../types/subscription';

/**
 * 订阅仓储类
 */
export class SubscriptionRepository extends BaseRepository<Subscription> {
  constructor(realm: Realm) {
    super(realm, 'Subscription');
  }

  /**
   * 创建订阅
   * @param params 创建订阅参数
   * @returns 创建的订阅
   */
  async createSubscription(params: CreateSubscriptionParams): Promise<Subscription> {
    return this.executeOperation(async () => {
      const now = new Date();
      const renewalDate = SubscriptionModel.calculateRenewalDate(params.startDate, params.type);

      const subscriptionData: Subscription = {
        id: this.generateUUID(),
        userId: params.userId,
        name: params.name,
        description: params.description,
        categoryId: params.categoryId,
        tags: params.tags || [],
        type: params.type,
        price: params.price,
        currency: params.currency || 'CNY',
        billingDate: params.billingDate,
        startDate: params.startDate,
        endDate: params.endDate,
        renewalDate,
        autoRenew: params.autoRenew ?? true,
        status: params.status || 'active',
        platform: params.platform,
        paymentMethod: params.paymentMethod,
        notes: params.notes,
        createdAt: now,
        updatedAt: now,
      };

      ValidationUtils.validateSubscription(subscriptionData);

      const realmData = SubscriptionModel.fromSubscriptionType(subscriptionData);

      return this.realm.write(() => {
        const created = this.realm.create('Subscription', realmData);
        return (created as any).toSubscriptionType();
      });
    }, '创建订阅失败');
  }

  /**
   * 更新订阅
   * @param id 订阅ID
   * @param params 更新订阅参数
   * @returns 更新后的订阅
   */
  async updateSubscription(id: string, params: UpdateSubscriptionParams): Promise<Subscription> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('订阅不存在');
      }

      const mergedData: Subscription = {
        ...existing,
        ...params,
        updatedAt: new Date(),
      };

      ValidationUtils.validateSubscription(mergedData);

      const realmData = SubscriptionModel.fromSubscriptionType(mergedData);

      return this.realm.write(() => {
        const updated = this.realm.create('Subscription', { ...realmData, id }, true);
        return (updated as any).toSubscriptionType();
      });
    }, '更新订阅失败');
  }

  /**
   * 根据用户ID获取订阅列表
   * @param userId 用户ID
   * @returns 订阅数组
   */
  async getByUserId(userId: string): Promise<Subscription[]> {
    return this.executeOperation(() => {
      const objects = this.realm.objects('Subscription').filtered('userId == $0', userId);
      return objects.map((obj: any) => obj.toSubscriptionType());
    }, '根据用户ID获取订阅列表失败');
  }

  /**
   * 根据分类ID获取订阅列表
   * @param categoryId 分类ID
   * @returns 订阅数组
   */
  async getByCategoryId(categoryId: string): Promise<Subscription[]> {
    return this.executeOperation(() => {
      const objects = this.realm.objects('Subscription').filtered('categoryId == $0', categoryId);
      return objects.map((obj: any) => obj.toSubscriptionType());
    }, '根据分类ID获取订阅列表失败');
  }

  /**
   * 根据状态获取订阅列表
   * @param status 订阅状态
   * @returns 订阅数组
   */
  async getByStatus(status: 'active' | 'cancelled' | 'expired'): Promise<Subscription[]> {
    return this.executeOperation(() => {
      const objects = this.realm.objects('Subscription').filtered('status == $0', status);
      return objects.map((obj: any) => obj.toSubscriptionType());
    }, '根据状态获取订阅列表失败');
  }

  /**
   * 根据类型获取订阅列表
   * @param type 订阅周期类型
   * @returns 订阅数组
   */
  async getByType(
    type: 'monthly' | 'yearly' | 'quarterly' | 'weekly' | 'one-time'
  ): Promise<Subscription[]> {
    return this.executeOperation(() => {
      const objects = this.realm.objects('Subscription').filtered('type == $0', type);
      return objects.map((obj: any) => obj.toSubscriptionType());
    }, '根据类型获取订阅列表失败');
  }

  /**
   * 根据标签获取订阅列表
   * @param tag 标签名称
   * @returns 订阅数组
   */
  async getByTag(tag: string): Promise<Subscription[]> {
    return this.executeOperation(() => {
      const objects = this.realm.objects('Subscription').filtered('tags CONTAINS $0', tag);
      return objects.map((obj: any) => obj.toSubscriptionType());
    }, '根据标签获取订阅列表失败');
  }

  /**
   * 查询订阅
   * @param params 查询参数
   * @returns 订阅数组
   */
  async querySubscriptions(params: SubscriptionQueryParams): Promise<Subscription[]> {
    return this.executeOperation(() => {
      let objects = this.realm.objects('Subscription');

      if (params.userId) {
        objects = objects.filtered('userId == $0', params.userId);
      }
      if (params.categoryId) {
        objects = objects.filtered('categoryId == $0', params.categoryId);
      }
      if (params.status) {
        objects = objects.filtered('status == $0', params.status);
      }
      if (params.type) {
        objects = objects.filtered('type == $0', params.type);
      }
      if (params.tags && params.tags.length > 0) {
        const tagQuery = params.tags.map((tag) => `tags CONTAINS "${tag}"`).join(' OR ');
        objects = objects.filtered(tagQuery);
      }
      if (params.startDate) {
        objects = objects.filtered('startDate >= $0', params.startDate);
      }
      if (params.endDate) {
        objects = objects.filtered('endDate <= $0', params.endDate);
      }
      if (params.renewalDateStart) {
        objects = objects.filtered('renewalDate >= $0', params.renewalDateStart);
      }
      if (params.renewalDateEnd) {
        objects = objects.filtered('renewalDate <= $0', params.renewalDateEnd);
      }

      return objects.map((obj: any) => obj.toSubscriptionType());
    }, '查询订阅失败');
  }

  /**
   * 获取即将到期的订阅（7天内）
   * @param userId 用户ID
   * @returns 即将到期的订阅数组
   */
  async getExpiringSoon(userId: string): Promise<Subscription[]> {
    return this.executeOperation(() => {
      const now = new Date();
      const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const objects = this.realm
        .objects('Subscription')
        .filtered(
          'userId == $0 AND status == "active" AND renewalDate >= $1 AND renewalDate <= $2',
          userId,
          now,
          sevenDaysLater
        )
        .sorted('renewalDate', true);
      return objects.map((obj: any) => obj.toSubscriptionType());
    }, '获取即将到期的订阅失败');
  }

  /**
   * 获取已过期的订阅
   * @param userId 用户ID
   * @returns 已过期的订阅数组
   */
  async getExpired(userId: string): Promise<Subscription[]> {
    return this.executeOperation(() => {
      const now = new Date();
      const objects = this.realm
        .objects('Subscription')
        .filtered('userId == $0 AND renewalDate < $1', userId, now)
        .sorted('renewalDate', true);
      return objects.map((obj: any) => obj.toSubscriptionType());
    }, '获取已过期的订阅失败');
  }

  /**
   * 获取活跃订阅
   * @param userId 用户ID
   * @returns 活跃订阅数组
   */
  async getActiveSubscriptions(userId: string): Promise<Subscription[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('Subscription')
        .filtered('userId == $0 AND status == "active"', userId)
        .sorted('renewalDate', true);
      return objects.map((obj: any) => obj.toSubscriptionType());
    }, '获取活跃订阅失败');
  }

  /**
   * 更新订阅状态
   * @param id 订阅ID
   * @param status 订阅状态
   * @returns 更新后的订阅
   */
  async updateStatus(
    id: string,
    status: 'active' | 'cancelled' | 'expired'
  ): Promise<Subscription> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('订阅不存在');
      }

      return this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('Subscription', id);
        if (object) {
          (object as any).status = status;
          (object as any).updatedAt = new Date();
          return (object as any).toSubscriptionType();
        }
        throw new Error('订阅不存在');
      });
    }, '更新订阅状态失败');
  }

  /**
   * 更新续费日期
   * @param id 订阅ID
   * @param renewalDate 续费日期
   * @returns 更新后的订阅
   */
  async updateRenewalDate(id: string, renewalDate: Date): Promise<Subscription> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('订阅不存在');
      }

      return this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('Subscription', id);
        if (object) {
          (object as any).renewalDate = renewalDate;
          (object as any).updatedAt = new Date();
          return (object as any).toSubscriptionType();
        }
        throw new Error('订阅不存在');
      });
    }, '更新续费日期失败');
  }

  /**
   * 更新自动续费设置
   * @param id 订阅ID
   * @param autoRenew 是否自动续费
   * @returns 更新后的订阅
   */
  async updateAutoRenew(id: string, autoRenew: boolean): Promise<Subscription> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('订阅不存在');
      }

      return this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('Subscription', id);
        if (object) {
          (object as any).autoRenew = autoRenew;
          (object as any).updatedAt = new Date();
          return (object as any).toSubscriptionType();
        }
        throw new Error('订阅不存在');
      });
    }, '更新自动续费设置失败');
  }

  /**
   * 添加标签到订阅
   * @param id 订阅ID
   * @param tag 标签名称
   * @returns 更新后的订阅
   */
  async addTag(id: string, tag: string): Promise<Subscription> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('订阅不存在');
      }

      if (existing.tags.includes(tag)) {
        throw new Error('标签已存在');
      }

      return this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('Subscription', id);
        if (object) {
          (object as any).tags.push(tag);
          (object as any).updatedAt = new Date();
          return (object as any).toSubscriptionType();
        }
        throw new Error('订阅不存在');
      });
    }, '添加标签失败');
  }

  /**
   * 从订阅移除标签
   * @param id 订阅ID
   * @param tag 标签名称
   * @returns 更新后的订阅
   */
  async removeTag(id: string, tag: string): Promise<Subscription> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('订阅不存在');
      }

      if (!existing.tags.includes(tag)) {
        throw new Error('标签不存在');
      }

      return this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('Subscription', id);
        if (object) {
          const tags = (object as any).tags;
          const index = tags.indexOf(tag);
          if (index > -1) {
            tags.splice(index, 1);
          }
          (object as any).updatedAt = new Date();
          return (object as any).toSubscriptionType();
        }
        throw new Error('订阅不存在');
      });
    }, '移除标签失败');
  }

  /**
   * 搜索订阅
   * @param userId 用户ID
   * @param keyword 搜索关键词
   * @returns 匹配的订阅数组
   */
  async searchSubscriptions(userId: string, keyword: string): Promise<Subscription[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('Subscription')
        .filtered(
          'userId == $0 AND (name CONTAINS[c] $1 OR description CONTAINS[c] $1)',
          userId,
          keyword
        );
      return objects.map((obj: any) => obj.toSubscriptionType());
    }, '搜索订阅失败');
  }

  /**
   * 按续费日期排序订阅
   * @param userId 用户ID
   * @param order 排序顺序
   * @returns 订阅数组
   */
  async sortByRenewalDate(userId: string, order: 'asc' | 'desc' = 'asc'): Promise<Subscription[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('Subscription')
        .filtered('userId == $0', userId)
        .sorted('renewalDate', order === 'desc');
      return objects.map((obj: any) => obj.toSubscriptionType());
    }, '按续费日期排序订阅失败');
  }

  /**
   * 按价格排序订阅
   * @param userId 用户ID
   * @param order 排序顺序
   * @returns 订阅数组
   */
  async sortByPrice(userId: string, order: 'asc' | 'desc' = 'desc'): Promise<Subscription[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('Subscription')
        .filtered('userId == $0', userId)
        .sorted('price', order === 'desc');
      return objects.map((obj: any) => obj.toSubscriptionType());
    }, '按价格排序订阅失败');
  }

  /**
   * 按创建时间排序订阅
   * @param userId 用户ID
   * @param order 排序顺序
   * @returns 订阅数组
   */
  async sortByCreatedAt(userId: string, order: 'asc' | 'desc' = 'desc'): Promise<Subscription[]> {
    return this.executeOperation(() => {
      const objects = this.realm
        .objects('Subscription')
        .filtered('userId == $0', userId)
        .sorted('createdAt', order === 'desc');
      return objects.map((obj: any) => obj.toSubscriptionType());
    }, '按创建时间排序订阅失败');
  }

  /**
   * 获取订阅统计信息
   * @param userId 用户ID
   * @returns 统计信息
   */
  async getSubscriptionStats(userId: string): Promise<SubscriptionStats> {
    return this.executeOperation(() => {
      const objects = this.realm.objects('Subscription').filtered('userId == $0', userId);

      const totalSubscriptions = objects.length;
      const activeSubscriptions = objects.filtered('status == "active"').length;
      const cancelledSubscriptions = objects.filtered('status == "cancelled"').length;
      const expiredSubscriptions = objects.filtered('status == "expired"').length;

      let totalMonthlyExpense = 0;
      let totalYearlyExpense = 0;

      const now = new Date();
      const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const upcomingRenewals = objects.filtered(
        'status == "active" AND renewalDate >= $0 AND renewalDate <= $1',
        now,
        sevenDaysLater
      ).length;

      const expiringSoon = upcomingRenewals;

      for (const obj of objects) {
        const type = obj.type as string;
        const price = obj.price as number;
        totalMonthlyExpense += this.calculateMonthlyCost(price, type);
        totalYearlyExpense += this.calculateYearlyCost(price, type);
      }

      return {
        totalSubscriptions,
        activeSubscriptions,
        cancelledSubscriptions,
        expiredSubscriptions,
        totalMonthlyExpense,
        totalYearlyExpense,
        upcomingRenewals,
        expiringSoon,
      };
    }, '获取订阅统计信息失败');
  }

  /**
   * 获取本月需要续费的订阅
   * @param userId 用户ID
   * @returns 订阅数组
   */
  async getMonthlyRenewals(userId: string): Promise<Subscription[]> {
    return this.executeOperation(() => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const objects = this.realm
        .objects('Subscription')
        .filtered(
          'userId == $0 AND status == "active" AND renewalDate >= $1 AND renewalDate <= $2',
          userId,
          startOfMonth,
          endOfMonth
        )
        .sorted('renewalDate', true);

      return objects.map((obj: any) => obj.toSubscriptionType());
    }, '获取本月需要续费的订阅失败');
  }

  /**
   * 批量更新订阅状态
   * @param ids 订阅ID数组
   * @param status 订阅状态
   * @returns 更新后的订阅数组
   */
  async batchUpdateStatus(
    ids: string[],
    status: 'active' | 'cancelled' | 'expired'
  ): Promise<Subscription[]> {
    return this.executeOperation(() => {
      return this.realm.write(() => {
        const updated: Subscription[] = [];
        for (const id of ids) {
          const object = this.realm.objectForPrimaryKey('Subscription', id);
          if (object) {
            (object as any).status = status;
            (object as any).updatedAt = new Date();
            updated.push((object as any).toSubscriptionType());
          }
        }
        return updated;
      });
    }, '批量更新订阅状态失败');
  }

  /**
   * 删除订阅
   * @param id 订阅ID
   */
  async deleteSubscription(id: string): Promise<void> {
    return this.executeOperation(async () => {
      const existing = await this.getById(id);
      if (!existing) {
        throw new Error('订阅不存在');
      }

      this.realm.write(() => {
        const object = this.realm.objectForPrimaryKey('Subscription', id);
        if (object) {
          this.realm.delete(object);
        }
      });

      Logger.info(`订阅已删除: ${id}`);
    }, '删除订阅失败');
  }

  /**
   * 清空用户的所有订阅
   * @param userId 用户ID
   */
  async clearUserSubscriptions(userId: string): Promise<void> {
    return this.executeOperation(() => {
      this.realm.write(() => {
        const objects = this.realm.objects('Subscription').filtered('userId == $0', userId);
        this.realm.delete(objects);
      });
      Logger.info(`用户 ${userId} 的所有订阅已清空`);
    }, '清空用户订阅失败');
  }

  /**
   * 计算月度费用（将所有周期转换为月度费用）
   * @param price 价格
   * @param type 订阅类型
   * @returns 月度费用
   */
  private calculateMonthlyCost(price: number, type: string): number {
    switch (type) {
      case 'weekly':
        return price * 4.33;
      case 'monthly':
        return price;
      case 'quarterly':
        return price / 3;
      case 'yearly':
        return price / 12;
      case 'one-time':
        return 0;
      default:
        return price;
    }
  }

  /**
   * 计算年度费用（将所有周期转换为年度费用）
   * @param price 价格
   * @param type 订阅类型
   * @returns 年度费用
   */
  private calculateYearlyCost(price: number, type: string): number {
    switch (type) {
      case 'weekly':
        return price * 52;
      case 'monthly':
        return price * 12;
      case 'quarterly':
        return price * 4;
      case 'yearly':
        return price;
      case 'one-time':
        return price;
      default:
        return price * 12;
    }
  }
}
