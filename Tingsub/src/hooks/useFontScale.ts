import { useCallback, useEffect, useState } from 'react';
import { StorageUtils } from '../utils/storageUtils';
import { USER_STORAGE_KEYS } from '../constants/storageKeys';

// 字体大小类型定义
export type FontScaleType = 'small' | 'medium' | 'large' | 'extraLarge';

// 字体大小选项
export const FONT_SCALE_OPTIONS: Array<{
  value: FontScaleType;
  label: string;
  scale: number;
}> = [
  { value: 'small', label: '小', scale: 0.85 },
  { value: 'medium', label: '中', scale: 1.0 },
  { value: 'large', label: '大', scale: 1.15 },
  { value: 'extraLarge', label: '超大', scale: 1.3 },
];

/**
 * 自定义Hook用于管理字体大小设置
 * 支持小、中、大、超大四种字体大小
 */
export const useFontScale = () => {
  const [fontScale, setFontScale] = useState<FontScaleType>('medium');
  const [currentScale, setCurrentScale] = useState<number>(1.0);

  // 从存储加载字体大小设置
  useEffect(() => {
    const loadFontScale = async () => {
      try {
        const savedFontScale = await StorageUtils.getItem<string>(USER_STORAGE_KEYS.FONT_SIZE_SETTING);
        if (savedFontScale) {
          const validFontScale = FONT_SCALE_OPTIONS.find(
            (option) => option.value === savedFontScale
          );
          if (validFontScale) {
            setFontScale(validFontScale.value);
            setCurrentScale(validFontScale.scale);
          }
        }
      } catch (err) {
        console.error('加载字体大小失败:', err);
      }
    };

    loadFontScale();
  }, []);

  // 切换字体大小
  const changeFontScale = useCallback(async (newFontScale: FontScaleType) => {
    try {
      const option = FONT_SCALE_OPTIONS.find((opt) => opt.value === newFontScale);
      if (option) {
        setFontScale(option.value);
        setCurrentScale(option.scale);
        await StorageUtils.setItem(USER_STORAGE_KEYS.FONT_SIZE_SETTING, option.value);
      }
    } catch (err) {
      console.error('保存字体大小失败:', err);
    }
  }, []);

  // 切换到小字体
  const switchToSmall = useCallback(() => {
    changeFontScale('small');
  }, [changeFontScale]);

  // 切换到中字体
  const switchToMedium = useCallback(() => {
    changeFontScale('medium');
  }, [changeFontScale]);

  // 切换到大字体
  const switchToLarge = useCallback(() => {
    changeFontScale('large');
  }, [changeFontScale]);

  // 切换到超大字体
  const switchToExtraLarge = useCallback(() => {
    changeFontScale('extraLarge');
  }, [changeFontScale]);

  // 根据基础字号计算缩放后的字号
  const getScaledFontSize = useCallback(
    (baseFontSize: number): number => {
      return baseFontSize * currentScale;
    },
    [currentScale]
  );

  // 根据基础行高计算缩放后的行高
  const getScaledLineHeight = useCallback(
    (baseLineHeight: number): number => {
      return baseLineHeight * currentScale;
    },
    [currentScale]
  );

  return {
    fontScale,
    currentScale,
    changeFontScale,
    switchToSmall,
    switchToMedium,
    switchToLarge,
    switchToExtraLarge,
    getScaledFontSize,
    getScaledLineHeight,
  };
};
