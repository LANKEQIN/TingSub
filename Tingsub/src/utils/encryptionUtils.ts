/**
 * 加密工具
 * 提供数据加密和解密功能
 */

import * as CryptoJS from 'crypto-js';
import { ENV } from '../config/env';

/**
 * 加密密钥（从环境变量获取，如果没有则使用默认值）
 * 注意：生产环境必须使用环境变量设置加密密钥
 */
const ENCRYPTION_KEY = ENV.REALM_ENCRYPTION_KEY || 'default-encryption-key-change-in-production';

/**
 * 加密配置
 */
const ENCRYPTION_CONFIG = {
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
  iv: CryptoJS.enc.Utf8.parse('1234567890123456'),
};

/**
 * 加密工具类
 */
export class EncryptionUtils {
  /**
   * 加密字符串
   * @param plaintext 明文
   * @returns 加密后的字符串
   */
  static encrypt(plaintext: string): string {
    try {
      const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
      const encrypted = CryptoJS.AES.encrypt(plaintext, key, ENCRYPTION_CONFIG);
      return encrypted.toString();
    } catch (error) {
      throw new Error(`加密失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 解密字符串
   * @param ciphertext 密文
   * @returns 解密后的字符串
   */
  static decrypt(ciphertext: string): string {
    try {
      const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
      const decrypted = CryptoJS.AES.decrypt(ciphertext, key, ENCRYPTION_CONFIG);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      throw new Error(`解密失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 加密对象
   * @param obj 对象
   * @returns 加密后的字符串
   */
  static encryptObject<T>(obj: T): string {
    try {
      const jsonString = JSON.stringify(obj);
      return this.encrypt(jsonString);
    } catch (error) {
      throw new Error(`对象加密失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 解密对象
   * @param ciphertext 密文
   * @returns 解密后的对象
   */
  static decryptObject<T>(ciphertext: string): T {
    try {
      const jsonString = this.decrypt(ciphertext);
      return JSON.parse(jsonString) as T;
    } catch (error) {
      throw new Error(`对象解密失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 加密数字
   * @param number 数字
   * @returns 加密后的字符串
   */
  static encryptNumber(number: number): string {
    return this.encrypt(number.toString());
  }

  /**
   * 解密数字
   * @param ciphertext 密文
   * @returns 解密后的数字
   */
  static decryptNumber(ciphertext: string): number {
    const decrypted = this.decrypt(ciphertext);
    return parseFloat(decrypted);
  }

  /**
   * 加密布尔值
   * @param value 布尔值
   * @returns 加密后的字符串
   */
  static encryptBoolean(value: boolean): string {
    return this.encrypt(value.toString());
  }

  /**
   * 解密布尔值
   * @param ciphertext 密文
   * @returns 解密后的布尔值
   */
  static decryptBoolean(ciphertext: string): boolean {
    const decrypted = this.decrypt(ciphertext);
    return decrypted === 'true';
  }

  /**
   * 加密日期
   * @param date 日期对象
   * @returns 加密后的字符串
   */
  static encryptDate(date: Date): string {
    return this.encrypt(date.toISOString());
  }

  /**
   * 解密日期
   * @param ciphertext 密文
   * @returns 解密后的日期对象
   */
  static decryptDate(ciphertext: string): Date {
    const decrypted = this.decrypt(ciphertext);
    return new Date(decrypted);
  }

  /**
   * 加密数组
   * @param array 数组
   * @returns 加密后的字符串
   */
  static encryptArray<T>(array: T[]): string {
    return this.encryptObject(array);
  }

  /**
   * 解密数组
   * @param ciphertext 密文
   * @returns 解密后的数组
   */
  static decryptArray<T>(ciphertext: string): T[] {
    return this.decryptObject<T[]>(ciphertext);
  }

  /**
   * 生成哈希值（MD5）
   * @param plaintext 明文
   * @returns 哈希值
   */
  static hashMD5(plaintext: string): string {
    return CryptoJS.MD5(plaintext).toString();
  }

  /**
   * 生成哈希值（SHA-256）
   * @param plaintext 明文
   * @returns 哈希值
   */
  static hashSHA256(plaintext: string): string {
    return CryptoJS.SHA256(plaintext).toString();
  }

  /**
   * 生成哈希值（SHA-512）
   * @param plaintext 明文
   * @returns 哈希值
   */
  static hashSHA512(plaintext: string): string {
    return CryptoJS.SHA512(plaintext).toString();
  }

  /**
   * 生成随机字符串
   * @param length 长度
   * @returns 随机字符串
   */
  static generateRandomString(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * 生成UUID
   * @returns UUID字符串
   */
  static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Base64编码
   * @param plaintext 明文
   * @returns Base64编码后的字符串
   */
  static base64Encode(plaintext: string): string {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(plaintext));
  }

  /**
   * Base64解码
   * @param ciphertext Base64编码的字符串
   * @returns 解码后的字符串
   */
  static base64Decode(ciphertext: string): string {
    return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(ciphertext));
  }

  /**
   * 十六进制编码
   * @param plaintext 明文
   * @returns 十六进制编码后的字符串
   */
  static hexEncode(plaintext: string): string {
    return CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(plaintext));
  }

  /**
   * 十六进制解码
   * @param ciphertext 十六进制编码的字符串
   * @returns 解码后的字符串
   */
  static hexDecode(ciphertext: string): string {
    return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Hex.parse(ciphertext));
  }

  /**
   * URL编码
   * @param plaintext 明文
   * @returns URL编码后的字符串
   */
  static urlEncode(plaintext: string): string {
    return encodeURIComponent(plaintext);
  }

  /**
   * URL解码
   * @param ciphertext URL编码的字符串
   * @returns 解码后的字符串
   */
  static urlDecode(ciphertext: string): string {
    return decodeURIComponent(ciphertext);
  }

  /**
   * 比较两个哈希值是否相等（防止时序攻击）
   * @param hash1 哈希值1
   * @param hash2 哈希值2
   * @returns 是否相等
   */
  static compareHashes(hash1: string, hash2: string): boolean {
    if (hash1.length !== hash2.length) {
      return false;
    }
    let result = 0;
    for (let i = 0; i < hash1.length; i++) {
      result |= hash1.charCodeAt(i) ^ hash2.charCodeAt(i);
    }
    return result === 0;
  }

  /**
   * 验证哈希值
   * @param plaintext 明文
   * @param hash 哈希值
   * @param algorithm 哈希算法，默认为SHA-256
   * @returns 是否匹配
   */
  static verifyHash(
    plaintext: string,
    hash: string,
    algorithm: 'md5' | 'sha256' | 'sha512' = 'sha256'
  ): boolean {
    let computedHash: string;
    switch (algorithm) {
      case 'md5':
        computedHash = this.hashMD5(plaintext);
        break;
      case 'sha256':
        computedHash = this.hashSHA256(plaintext);
        break;
      case 'sha512':
        computedHash = this.hashSHA512(plaintext);
        break;
      default:
        computedHash = this.hashSHA256(plaintext);
    }
    return this.compareHashes(computedHash, hash);
  }

  /**
   * 生成HMAC
   * @param plaintext 明文
   * @param secret 密钥
   * @param algorithm 哈希算法，默认为SHA-256
   * @returns HMAC值
   */
  static generateHMAC(
    plaintext: string,
    secret: string,
    algorithm: 'md5' | 'sha256' | 'sha512' = 'sha256'
  ): string {
    let hash: CryptoJS.lib.WordArray;
    switch (algorithm) {
      case 'md5':
        hash = CryptoJS.HmacMD5(plaintext, secret);
        break;
      case 'sha256':
        hash = CryptoJS.HmacSHA256(plaintext, secret);
        break;
      case 'sha512':
        hash = CryptoJS.HmacSHA512(plaintext, secret);
        break;
      default:
        hash = CryptoJS.HmacSHA256(plaintext, secret);
    }
    return hash.toString();
  }

  /**
   * 验证HMAC
   * @param plaintext 明文
   * @param secret 密钥
   * @param hmac HMAC值
   * @param algorithm 哈希算法，默认为SHA-256
   * @returns 是否匹配
   */
  static verifyHMAC(
    plaintext: string,
    secret: string,
    hmac: string,
    algorithm: 'md5' | 'sha256' | 'sha512' = 'sha256'
  ): boolean {
    const computedHMAC = this.generateHMAC(plaintext, secret, algorithm);
    return this.compareHashes(computedHMAC, hmac);
  }

  /**
   * 派生密钥（PBKDF2）
   * @param password 密码
   * @param salt 盐值
   * @param iterations 迭代次数，默认为10000
   * @param keySize 密钥大小（以字为单位），默认为256/32=8
   * @returns 派生密钥
   */
  static deriveKey(
    password: string,
    salt: string,
    iterations: number = 10000,
    keySize: number = 256 / 32
  ): string {
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize,
      iterations,
    });
    return key.toString();
  }

  /**
   * 生成盐值
   * @param length 长度，默认为16
   * @returns 盐值
   */
  static generateSalt(length: number = 16): string {
    return CryptoJS.lib.WordArray.random(length).toString();
  }

  /**
   * 安全地比较两个字符串（防止时序攻击）
   * @param str1 字符串1
   * @param str2 字符串2
   * @returns 是否相等
   */
  static secureCompare(str1: string, str2: string): boolean {
    if (str1.length !== str2.length) {
      return false;
    }
    let result = 0;
    for (let i = 0; i < str1.length; i++) {
      result |= str1.charCodeAt(i) ^ str2.charCodeAt(i);
    }
    return result === 0;
  }

  /**
   * 检查加密密钥是否为默认值
   * @returns 是否为默认密钥
   */
  static isDefaultKey(): boolean {
    return ENCRYPTION_KEY === 'default-encryption-key-change-in-production';
  }

  /**
   * 获取加密密钥的哈希值（用于调试）
   * @returns 加密密钥的哈希值
   */
  static getKeyHash(): string {
    return this.hashSHA256(ENCRYPTION_KEY);
  }
}

/**
 * 敏感数据加密装饰器
 * 用于自动加密和解密敏感字段
 */
export function encryptField<T extends Record<string, any>>(obj: T, fields: (keyof T)[]): T {
  const encrypted = { ...obj };
  for (const field of fields) {
    if (encrypted[field] !== undefined && encrypted[field] !== null) {
      encrypted[field] = EncryptionUtils.encrypt(String(encrypted[field])) as any;
    }
  }
  return encrypted;
}

/**
 * 敏感数据解密装饰器
 * 用于自动解密敏感字段
 */
export function decryptField<T extends Record<string, any>>(obj: T, fields: (keyof T)[]): T {
  const decrypted = { ...obj };
  for (const field of fields) {
    if (decrypted[field] !== undefined && decrypted[field] !== null) {
      decrypted[field] = EncryptionUtils.decrypt(String(decrypted[field])) as any;
    }
  }
  return decrypted;
}
