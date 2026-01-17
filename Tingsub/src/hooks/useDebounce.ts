import { useEffect, useState } from 'react';

/**
 * 自定义Hook用于防抖处理
 * @param value - 需要防抖的值
 * @param delay - 防抖延迟时间（毫秒）
 * @returns 防抖后的值
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 设置定时器，在延迟时间后更新防抖值
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清除定时器，防止内存泄漏
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * 自定义Hook用于防抖函数
 * @param func - 需要防抖的函数
 * @param delay - 防抖延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = 500
): ((...args: Parameters<T>) => void) => {
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  return (...args: Parameters<T>) => {
    // 清除之前的定时器
    if (timer) {
      clearTimeout(timer);
    }

    // 设置新的定时器
    const newTimer = setTimeout(() => {
      func(...args);
    }, delay);

    setTimer(newTimer);
  };
};
