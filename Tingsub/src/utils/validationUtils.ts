/**
 * 数据验证工具
 * 提供数据验证功能，使用Yup进行Schema验证
 */

import * as yup from 'yup';
import type { User, Subscription, Category, Tag, ReminderSettings } from '../../types';

/**
 * 自定义验证错误类
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public details?: string[]
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * 通知渠道验证Schema
 */
const notificationChannelSchema = yup.object().shape({
  type: yup.string().required('通知类型不能为空').oneOf(['local'], '通知类型不正确'),
  enabled: yup.boolean().required('通知开关不能为空'),
  sound: yup.boolean().required('声音开关不能为空'),
  vibration: yup.boolean().required('震动开关不能为空'),
});

/**
 * 提醒设置验证Schema
 */
export const reminderSettingsSchema = yup.object().shape({
  enabled: yup.boolean().required('提醒开关不能为空'),
  advanceDays: yup
    .number()
    .required('提前天数不能为空')
    .integer('提前天数必须为整数')
    .min(1, '提前天数至少1天')
    .max(7, '提前天数最多7天'),
  repeatInterval: yup
    .string()
    .required('重复间隔不能为空')
    .oneOf(['none', 'daily', 'weekly'], '重复间隔值不正确'),
  notificationChannels: yup.array().of(notificationChannelSchema).required('通知渠道不能为空'),
});

/**
 * 用户信息验证Schema
 */
export const userSchema = yup.object().shape({
  id: yup.string().required('用户ID不能为空').uuid('用户ID格式不正确'),
  username: yup
    .string()
    .required('用户名不能为空')
    .min(2, '用户名至少2个字符')
    .max(50, '用户名最多50个字符')
    .matches(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, '用户名只能包含字母、数字、下划线和中文'),
  email: yup.string().optional().email('邮箱格式不正确').max(100, '邮箱最多100个字符'),
  avatar: yup.string().optional().max(500, '头像路径过长'),
  theme: yup
    .string()
    .required('主题设置不能为空')
    .oneOf(['light', 'dark', 'system'], '主题设置值不正确'),
  currency: yup
    .string()
    .required('货币类型不能为空')
    .matches(/^[A-Z]{3}$/, '货币类型格式不正确，如CNY、USD'),
  reminderSettings: reminderSettingsSchema.required('提醒设置不能为空'),
  createdAt: yup.date().required('创建时间不能为空'),
  updatedAt: yup.date().required('更新时间不能为空'),
});

/**
 * 订阅信息验证Schema
 */
export const subscriptionSchema = yup.object().shape({
  id: yup.string().required('订阅ID不能为空').uuid('订阅ID格式不正确'),
  userId: yup.string().required('用户ID不能为空').uuid('用户ID格式不正确'),
  name: yup
    .string()
    .required('订阅名称不能为空')
    .min(1, '订阅名称至少1个字符')
    .max(100, '订阅名称最多100个字符'),
  description: yup.string().optional().max(500, '描述最多500个字符'),
  categoryId: yup.string().required('分类ID不能为空').uuid('分类ID格式不正确'),
  tags: yup.array().of(yup.string().max(50, '标签最多50个字符')).optional().max(10, '最多10个标签'),
  type: yup
    .string()
    .required('订阅周期不能为空')
    .oneOf(['monthly', 'yearly', 'quarterly', 'weekly', 'one-time'], '订阅周期值不正确'),
  price: yup
    .number()
    .required('订阅费用不能为空')
    .positive('订阅费用必须大于0')
    .max(999999.99, '订阅费用超出范围'),
  currency: yup
    .string()
    .required('货币类型不能为空')
    .matches(/^[A-Z]{3}$/, '货币类型格式不正确，如CNY、USD'),
  billingDate: yup.date().required('计费日期不能为空'),
  startDate: yup.date().required('开始日期不能为空'),
  endDate: yup.date().optional().min(yup.ref('startDate'), '结束日期不能早于开始日期'),
  renewalDate: yup.date().required('续费日期不能为空'),
  autoRenew: yup.boolean().required('自动续费开关不能为空'),
  status: yup
    .string()
    .required('订阅状态不能为空')
    .oneOf(['active', 'cancelled', 'expired'], '订阅状态值不正确'),
  platform: yup.string().required('订阅平台不能为空').max(50, '平台名称最多50个字符'),
  paymentMethod: yup.string().required('支付方式不能为空').max(50, '支付方式最多50个字符'),
  notes: yup.string().optional().max(1000, '备注最多1000个字符'),
  createdAt: yup.date().required('创建时间不能为空'),
  updatedAt: yup.date().required('更新时间不能为空'),
});

/**
 * 分类信息验证Schema
 */
export const categorySchema = yup.object().shape({
  id: yup.string().required('分类ID不能为空').uuid('分类ID格式不正确'),
  userId: yup.string().required('用户ID不能为空').uuid('用户ID格式不正确'),
  name: yup
    .string()
    .required('分类名称不能为空')
    .min(1, '分类名称至少1个字符')
    .max(50, '分类名称最多50个字符'),
  description: yup.string().optional().max(200, '描述最多200个字符'),
  color: yup
    .string()
    .required('分类颜色不能为空')
    .matches(/^#[0-9A-Fa-f]{6}$/, '颜色格式不正确，如#FF0000'),
  icon: yup.string().required('分类图标不能为空').max(50, '图标名称最多50个字符'),
  isDefault: yup.boolean().required('是否默认分类不能为空'),
  createdAt: yup.date().required('创建时间不能为空'),
  updatedAt: yup.date().required('更新时间不能为空'),
});

/**
 * 标签信息验证Schema
 */
export const tagSchema = yup.object().shape({
  id: yup.string().required('标签ID不能为空').uuid('标签ID格式不正确'),
  userId: yup.string().required('用户ID不能为空').uuid('用户ID格式不正确'),
  name: yup
    .string()
    .required('标签名称不能为空')
    .min(1, '标签名称至少1个字符')
    .max(50, '标签名称最多50个字符'),
  color: yup
    .string()
    .required('标签颜色不能为空')
    .matches(/^#[0-9A-Fa-f]{6}$/, '颜色格式不正确，如#FF0000'),
  createdAt: yup.date().required('创建时间不能为空'),
  updatedAt: yup.date().required('更新时间不能为空'),
});

/**
 * 验证工具类
 */
export class ValidationUtils {
  /**
   * 验证用户数据
   */
  static validateUser(data: any): User {
    try {
      return userSchema.validateSync(data, { abortEarly: false }) as User;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new ValidationError('用户数据验证失败', error.errors);
      }
      throw error;
    }
  }

  /**
   * 验证订阅数据
   */
  static validateSubscription(data: any): Subscription {
    try {
      const validated = subscriptionSchema.validateSync(data, { abortEarly: false });
      return {
        ...validated,
        tags: validated.tags || [],
      } as Subscription;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new ValidationError('订阅数据验证失败', error.errors);
      }
      throw error;
    }
  }

  /**
   * 验证分类数据
   */
  static validateCategory(data: any): Category {
    try {
      return categorySchema.validateSync(data, { abortEarly: false }) as Category;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new ValidationError('分类数据验证失败', error.errors);
      }
      throw error;
    }
  }

  /**
   * 验证标签数据
   */
  static validateTag(data: any): Tag {
    try {
      return tagSchema.validateSync(data, { abortEarly: false }) as Tag;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new ValidationError('标签数据验证失败', error.errors);
      }
      throw error;
    }
  }

  /**
   * 验证提醒设置
   */
  static validateReminderSettings(data: any): ReminderSettings {
    try {
      return reminderSettingsSchema.validateSync(data, { abortEarly: false }) as ReminderSettings;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new ValidationError('提醒设置验证失败', error.errors);
      }
      throw error;
    }
  }

  /**
   * 验证UUID格式
   */
  static validateUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * 验证邮箱格式
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 验证日期范围
   */
  static validateDateRange(startDate: Date, endDate?: Date): boolean {
    if (endDate && endDate < startDate) {
      throw new ValidationError('结束日期不能早于开始日期');
    }
    return true;
  }

  /**
   * 验证货币金额
   */
  static validateAmount(amount: number): boolean {
    if (amount <= 0 || amount > 999999.99) {
      throw new ValidationError('金额必须在0到999999.99之间');
    }
    return true;
  }

  /**
   * 验证颜色格式
   */
  static validateColor(color: string): boolean {
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!colorRegex.test(color)) {
      throw new ValidationError('颜色格式不正确，如#FF0000');
    }
    return true;
  }

  /**
   * 验证货币类型
   */
  static validateCurrency(currency: string): boolean {
    const currencyRegex = /^[A-Z]{3}$/;
    if (!currencyRegex.test(currency)) {
      throw new ValidationError('货币类型格式不正确，如CNY、USD');
    }
    return true;
  }

  /**
   * 验证用户名
   */
  static validateUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
    if (!usernameRegex.test(username)) {
      throw new ValidationError('用户名只能包含字母、数字、下划线和中文');
    }
    if (username.length < 2 || username.length > 50) {
      throw new ValidationError('用户名长度必须在2到50个字符之间');
    }
    return true;
  }

  /**
   * 验证URL格式
   */
  static validateURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      throw new ValidationError('URL格式不正确');
    }
  }

  /**
   * 验证字符串长度
   */
  static validateStringLength(
    value: string,
    min?: number,
    max?: number,
    fieldName: string = '字段'
  ): boolean {
    if (min !== undefined && value.length < min) {
      throw new ValidationError(`${fieldName}长度至少${min}个字符`);
    }
    if (max !== undefined && value.length > max) {
      throw new ValidationError(`${fieldName}长度最多${max}个字符`);
    }
    return true;
  }

  /**
   * 验证数组长度
   */
  static validateArrayLength<T>(
    array: T[],
    min?: number,
    max?: number,
    fieldName: string = '数组'
  ): boolean {
    if (min !== undefined && array.length < min) {
      throw new ValidationError(`${fieldName}至少包含${min}个元素`);
    }
    if (max !== undefined && array.length > max) {
      throw new ValidationError(`${fieldName}最多包含${max}个元素`);
    }
    return true;
  }

  /**
   * 验证必填字段
   */
  static validateRequired<T>(value: T | null | undefined, fieldName: string = '字段'): boolean {
    if (value === null || value === undefined || value === '') {
      throw new ValidationError(`${fieldName}不能为空`);
    }
    return true;
  }

  /**
   * 验证正则表达式匹配
   */
  static validateRegex(value: string, pattern: RegExp, errorMessage: string): boolean {
    if (!pattern.test(value)) {
      throw new ValidationError(errorMessage);
    }
    return true;
  }

  /**
   * 验证数字范围
   */
  static validateNumberRange(
    value: number,
    min?: number,
    max?: number,
    fieldName: string = '数值'
  ): boolean {
    if (min !== undefined && value < min) {
      throw new ValidationError(`${fieldName}必须大于或等于${min}`);
    }
    if (max !== undefined && value > max) {
      throw new ValidationError(`${fieldName}必须小于或等于${max}`);
    }
    return true;
  }

  /**
   * 验证枚举值
   */
  static validateEnum<T extends string>(
    value: T,
    allowedValues: readonly T[],
    fieldName: string = '字段'
  ): boolean {
    if (!allowedValues.includes(value)) {
      throw new ValidationError(`${fieldName}值不正确`);
    }
    return true;
  }

  /**
   * 批量验证
   */
  static validateBatch(validators: Array<() => boolean>): void {
    const errors: string[] = [];
    for (const validator of validators) {
      try {
        validator();
      } catch (error) {
        if (error instanceof ValidationError) {
          errors.push(error.message);
        }
      }
    }
    if (errors.length > 0) {
      throw new ValidationError('批量验证失败', errors);
    }
  }

  /**
   * 异步验证
   */
  static async validateAsync<T>(
    validator: () => Promise<T>,
    errorMessage: string = '验证失败'
  ): Promise<T> {
    try {
      return await validator();
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(errorMessage);
    }
  }
}
