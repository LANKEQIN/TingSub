import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// 按钮类型
export type ButtonType = 'primary' | 'secondary' | 'text';

// 按钮大小
export type ButtonSize = 'small' | 'medium' | 'large';

// 按钮Props接口
export interface ButtonProps {
  // 按钮文本
  title: string;
  // 按钮类型
  type?: ButtonType;
  // 按钮大小
  size?: ButtonSize;
  // 是否禁用
  disabled?: boolean;
  // 是否加载中
  loading?: boolean;
  // 按钮图标名称（MaterialCommunityIcons）
  icon?: string;
  // 图标位置
  iconPosition?: 'left' | 'right';
  // 点击事件
  onPress: () => void;
  // 自定义样式
  style?: ViewStyle;
  // 文本样式
  textStyle?: TextStyle;
}

// 按钮组件
const Button: React.FC<ButtonProps> = ({
  title,
  type = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onPress,
  style,
  textStyle,
}) => {
  const theme = useTheme() as any;

  // 获取按钮样式
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
    };

    // 根据大小设置样式
    switch (size) {
      case 'small':
        baseStyle.height = 36;
        baseStyle.paddingHorizontal = 16;
        baseStyle.minWidth = 72;
        break;
      case 'medium':
        baseStyle.height = 44;
        baseStyle.paddingHorizontal = 24;
        baseStyle.minWidth = 88;
        break;
      case 'large':
        baseStyle.height = 52;
        baseStyle.paddingHorizontal = 32;
        baseStyle.minWidth = 120;
        break;
    }

    // 根据类型设置样式
    switch (type) {
      case 'primary':
        baseStyle.backgroundColor = disabled ? theme.colors.disabled : theme.colors.primary;
        break;
      case 'secondary':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = disabled ? theme.colors.disabled : theme.colors.primary;
        break;
      case 'text':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.paddingHorizontal = 12;
        break;
    }

    return baseStyle;
  };

  // 获取文本样式
  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...styles.text,
    };

    // 根据大小设置字号
    switch (size) {
      case 'small':
        baseStyle.fontSize = 14;
        break;
      case 'medium':
        baseStyle.fontSize = 16;
        break;
      case 'large':
        baseStyle.fontSize = 18;
        break;
    }

    // 根据类型设置颜色
    switch (type) {
      case 'primary':
        baseStyle.color = '#FFFFFF';
        break;
      case 'secondary':
        baseStyle.color = disabled ? theme.colors.disabled : theme.colors.primary;
        break;
      case 'text':
        baseStyle.color = disabled ? theme.colors.disabled : theme.colors.primary;
        break;
    }

    return baseStyle;
  };

  // 获取图标大小
  const getIconSize = (): number => {
    switch (size) {
      case 'small':
        return 18;
      case 'medium':
        return 20;
      case 'large':
        return 24;
    }
  };

  // 渲染图标
  const renderIcon = () => {
    if (!icon) return null;

    const iconColor = type === 'primary' ? '#FFFFFF' : theme.colors.primary;

    return (
      <MaterialCommunityIcons
        name={icon as any}
        size={getIconSize()}
        color={disabled ? theme.colors.disabled : iconColor}
        style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight}
      />
    );
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={type === 'primary' ? '#FFFFFF' : theme.colors.primary}
          size={size === 'small' ? 'small' : 'large'}
        />
      ) : (
        <>
          {iconPosition === 'left' && renderIcon()}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {iconPosition === 'right' && renderIcon()}
        </>
      )}
    </TouchableOpacity>
  );
};

// 样式定义
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 44,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  text: {
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default Button;
