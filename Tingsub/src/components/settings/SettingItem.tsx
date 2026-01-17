import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

// 设置项类型
export type SettingItemType = 'default' | 'switch' | 'chevron' | 'toggle';

// 设置项Props接口
export interface SettingItemProps {
  // 设置项标题
  title: string;
  // 设置项描述
  description?: string;
  // 设置项图标名称（MaterialCommunityIcons）
  icon?: string;
  // 设置项类型
  type?: SettingItemType;
  // 是否禁用
  disabled?: boolean;
  // 是否显示开关状态（仅switch和toggle类型有效）
  value?: boolean;
  // 右侧文本（仅default类型有效）
  rightText?: string;
  // 点击事件
  onPress?: (event: GestureResponderEvent) => void;
  // 开关切换事件（仅switch和toggle类型有效）
  onValueChange?: (value: boolean) => void;
  // 自定义样式
  style?: ViewStyle;
  // 标题样式
  titleStyle?: TextStyle;
  // 描述样式
  descriptionStyle?: TextStyle;
}

// 设置项组件
const SettingItem: React.FC<SettingItemProps> = ({
  title,
  description,
  icon,
  type = 'default',
  disabled = false,
  value = false,
  rightText,
  onPress,
  onValueChange,
  style,
  titleStyle,
  descriptionStyle,
}) => {
  const { currentTheme: theme } = useTheme();

  // 渲染图标
  const renderIcon = () => {
    if (!icon) return null;

    return (
      <MaterialCommunityIcons
        name={icon as any}
        size={24}
        color={disabled ? theme.colors.disabled : theme.colors.primary}
        style={styles.icon}
      />
    );
  };

  // 渲染右侧内容
  const renderRightContent = () => {
    switch (type) {
      case 'chevron':
        return (
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={disabled ? theme.colors.disabled : theme.colors.placeholder}
          />
        );
      case 'switch':
        return (
          <MaterialCommunityIcons
            name={value ? 'toggle-switch' : 'toggle-switch-off'}
            size={48}
            color={disabled ? theme.colors.disabled : (value ? theme.colors.primary : theme.colors.placeholder)}
          />
        );
      case 'toggle':
        return (
          <MaterialCommunityIcons
            name={value ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
            size={24}
            color={disabled ? theme.colors.disabled : (value ? theme.colors.primary : theme.colors.placeholder)}
          />
        );
      case 'default':
      default:
        return rightText ? (
          <Text style={[styles.rightText, { color: theme.colors.placeholder }]}>
            {rightText}
          </Text>
        ) : null;
    }
  };

  // 处理点击事件
  const handlePress = (event: GestureResponderEvent) => {
    if (disabled) return;

    if (type === 'switch' || type === 'toggle') {
      onValueChange?.(!value);
    } else {
      onPress?.(event);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {renderIcon()}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            { color: disabled ? theme.colors.disabled : theme.colors.text },
            titleStyle,
          ]}
        >
          {title}
        </Text>
        {description && (
          <Text
            style={[
              styles.description,
              { color: theme.colors.placeholder },
              descriptionStyle,
            ]}
          >
            {description}
          </Text>
        )}
      </View>
      {renderRightContent()}
    </TouchableOpacity>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  icon: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  rightText: {
    fontSize: 14,
    fontWeight: '400',
  },
});

export default SettingItem;
