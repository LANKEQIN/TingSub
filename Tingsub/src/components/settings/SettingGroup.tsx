import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Card from '../common/Card';
import { useTheme } from '../../hooks/useTheme';

// 设置组Props接口
export interface SettingGroupProps {
  // 设置组标题
  title?: string;
  // 设置组描述
  description?: string;
  // 设置组内容
  children: React.ReactNode;
  // 自定义样式
  style?: ViewStyle;
  // 标题样式
  titleStyle?: TextStyle;
  // 描述样式
  descriptionStyle?: TextStyle;
  // 是否显示边框
  showBorder?: boolean;
  // 内边距
  padding?: number;
  // 外边距
  margin?: number;
}

// 设置组组件
const SettingGroup: React.FC<SettingGroupProps> = ({
  title,
  description,
  children,
  style,
  titleStyle,
  descriptionStyle,
  showBorder = true,
  padding = 0,
  margin = 12,
}) => {
  const { currentTheme: theme } = useTheme();

  return (
    <View style={[styles.container, { margin }, style]}>
      {(title || description) && (
        <View style={styles.header}>
          {title && (
            <Text
              style={[
                styles.title,
                { color: theme.colors.text },
                titleStyle,
              ]}
            >
              {title}
            </Text>
          )}
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
      )}
      <Card
        padding={padding}
        margin={0}
        elevation={0}
        style={StyleSheet.flatten([
          styles.card,
          showBorder && {
            borderWidth: 1,
            borderColor: theme.colors.placeholder,
          },
        ])}
      >
        {children}
      </Card>
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default SettingGroup;
