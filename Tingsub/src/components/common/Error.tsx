import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from './Button';

// 错误类型
export type ErrorType = 'network' | 'server' | 'client' | 'unknown';

// 错误Props接口
export interface ErrorProps {
  // 错误类型
  type?: ErrorType;
  // 错误标题
  title?: string;
  // 错误描述
  description?: string;
  // 重试按钮文本
  retryText?: string;
  // 重试按钮点击事件
  onRetry?: () => void;
  // 自定义样式
  style?: ViewStyle;
  // 标题样式
  titleStyle?: TextStyle;
  // 描述样式
  descriptionStyle?: TextStyle;
  // 是否显示图标
  showIcon?: boolean;
}

// 错误组件
const Error: React.FC<ErrorProps> = ({
  type = 'unknown',
  title,
  description,
  retryText = '重试',
  onRetry,
  style,
  titleStyle,
  descriptionStyle,
  showIcon = true,
}) => {
  const theme = useTheme() as any;

  // 获取错误信息
  const getErrorInfo = () => {
    switch (type) {
      case 'network':
        return {
          title: title || '网络连接失败',
          description: description || '请检查网络连接后重试',
          icon: 'network-off-outline',
        };
      case 'server':
        return {
          title: title || '服务器错误',
          description: description || '服务器暂时无法响应，请稍后重试',
          icon: 'server-network-off',
        };
      case 'client':
        return {
          title: title || '请求错误',
          description: description || '请求参数有误，请检查后重试',
          icon: 'alert-circle-outline',
        };
      default:
        return {
          title: title || '发生错误',
          description: description || '未知错误，请稍后重试',
          icon: 'alert-outline',
        };
    }
  };

  const errorInfo = getErrorInfo();

  // 渲染图标
  const renderIcon = () => {
    if (!showIcon) return null;

    return (
      <MaterialCommunityIcons
        name={errorInfo.icon as any}
        size={64}
        color={theme.colors.error}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {renderIcon()}
        <Text style={[styles.title, titleStyle, { color: theme.colors.text }]}>
          {errorInfo.title}
        </Text>
        <Text
          style={[styles.description, descriptionStyle, { color: theme.colors.placeholder }]}
        >
          {errorInfo.description}
        </Text>
        {onRetry && (
          <View style={styles.buttonContainer}>
            <Button
              title={retryText}
              type="primary"
              onPress={onRetry}
            />
          </View>
        )}
      </View>
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    marginTop: 8,
  },
});

export default Error;
