import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// 输入框Props接口
export interface InputProps extends Omit<TextInputProps, 'style'> {
  // 标签文本
  label?: string;
  // 错误信息
  error?: string;
  // 左侧图标名称
  leftIcon?: string;
  // 右侧图标名称
  rightIcon?: string;
  // 右侧图标点击事件
  onRightIconPress?: () => void;
  // 是否显示密码
  secureTextEntry?: boolean;
  // 是否必填
  required?: boolean;
  // 容器样式
  containerStyle?: ViewStyle;
  // 输入框样式
  inputStyle?: TextStyle;
  // 错误文本样式
  errorStyle?: TextStyle;
  // 标签样式
  labelStyle?: TextStyle;
}

// 输入框组件
const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  required = false,
  containerStyle,
  inputStyle,
  errorStyle,
  labelStyle,
  ...textInputProps
}) => {
  const theme = useTheme() as any;
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 判断是否显示密码切换图标
  const shouldShowPasswordToggle = secureTextEntry;

  // 获取输入框边框颜色
  const getBorderColor = (): string => {
    if (error) {
      return theme.colors.error;
    }
    if (isFocused) {
      return theme.colors.primary;
    }
    return theme.colors.placeholder;
  };

  // 获取输入框背景色
  const getBackgroundColor = (): string => {
    if (textInputProps.editable === false) {
      return theme.colors.surface;
    }
    return theme.colors.background;
  };

  // 渲染左侧图标
  const renderLeftIcon = () => {
    if (!leftIcon) return null;

    return (
      <MaterialCommunityIcons
        name={leftIcon as any}
        size={20}
        color={error ? theme.colors.error : theme.colors.placeholder}
        style={styles.leftIcon}
      />
    );
  };

  // 渲染右侧图标
  const renderRightIcon = () => {
    if (shouldShowPasswordToggle) {
      return (
        <MaterialCommunityIcons
          name={showPassword ? 'eye-off' : 'eye'}
          size={20}
          color={theme.colors.placeholder}
          style={styles.rightIcon}
          onPress={() => setShowPassword(!showPassword)}
        />
      );
    }

    if (rightIcon) {
      return (
        <MaterialCommunityIcons
          name={rightIcon as any}
          size={20}
          color={theme.colors.placeholder}
          style={styles.rightIcon}
          onPress={onRightIconPress}
        />
      );
    }

    return null;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, labelStyle, { color: theme.colors.text }]}>
            {label}
          </Text>
          {required && (
            <Text style={[styles.required, { color: theme.colors.error }]}>
              *
            </Text>
          )}
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
          },
        ]}
      >
        {renderLeftIcon()}
        <TextInput
          style={[styles.input, inputStyle, { color: theme.colors.text }]}
          placeholderTextColor={theme.colors.placeholder}
          secureTextEntry={secureTextEntry && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
        {renderRightIcon()}
      </View>

      {error && (
        <Text style={[styles.errorText, errorStyle, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  required: {
    marginLeft: 4,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;
