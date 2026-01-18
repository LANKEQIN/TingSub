import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useFontScale, FontScaleType, FONT_SCALE_OPTIONS } from '../../hooks/useFontScale';

// 字体大小切换器Props接口
export interface FontScaleSwitchProps {
  // 当前字体大小值
  value?: FontScaleType;
  // 自定义样式
  style?: ViewStyle;
  // 标题样式
  titleStyle?: TextStyle;
  // 是否显示图标
  showIcon?: boolean;
  // 字体大小切换回调
  onFontScaleChange?: (fontScale: FontScaleType) => void;
}

// 字体大小切换器组件
const FontScaleSwitch: React.FC<FontScaleSwitchProps> = ({
  value,
  style,
  titleStyle,
  showIcon = true,
  onFontScaleChange,
}) => {
  const { currentTheme } = useTheme();
  const { fontScale, changeFontScale } = useFontScale();
  const [selectedFontScale, setSelectedFontScale] = useState<FontScaleType>(value || fontScale);

  // 处理字体大小切换
  const handleFontScaleChange = async (fontScaleValue: FontScaleType) => {
    setSelectedFontScale(fontScaleValue);
    await changeFontScale(fontScaleValue);
    onFontScaleChange?.(fontScaleValue);
  };

  // 渲染字体大小选项
  const renderFontScaleOption = (option: typeof FONT_SCALE_OPTIONS[number]) => {
    const isSelected = selectedFontScale === option.value;
    const fontSize = 14 * option.scale;

    return (
      <TouchableOpacity
        key={option.value}
        style={[
          styles.option,
          {
            backgroundColor: isSelected ? currentTheme.colors.primary : currentTheme.colors.surface,
            borderColor: isSelected ? currentTheme.colors.primary : currentTheme.colors.placeholder,
          },
        ]}
        onPress={() => handleFontScaleChange(option.value)}
        activeOpacity={0.7}
      >
        {showIcon && (
          <MaterialCommunityIcons
            name="format-size"
            size={24}
            color={isSelected ? '#FFFFFF' : currentTheme.colors.text}
            style={styles.optionIcon}
          />
        )}
        <Text
          style={[
            styles.optionLabel,
            {
              color: isSelected ? '#FFFFFF' : currentTheme.colors.text,
              fontSize,
            },
            titleStyle,
          ]}
        >
          {option.label}
        </Text>
        {isSelected && (
          <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" style={styles.checkIcon} />
        )}
      </TouchableOpacity>
    );
  };

  return <View style={[styles.container, style]}>{FONT_SCALE_OPTIONS.map(renderFontScaleOption)}</View>;
};

// 样式定义
const styles = StyleSheet.create({
  checkIcon: {
    marginLeft: 8,
  },
  container: {
    gap: 8,
    width: '100%',
  },
  option: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionLabel: {
    flex: 1,
    fontWeight: '500',
    lineHeight: 24,
  },
});

export default FontScaleSwitch;
