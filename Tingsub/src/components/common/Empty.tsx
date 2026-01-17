import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from './Button';

// 空状态Props接口
export interface EmptyProps {
  // 图标名称
  iconName?: string;
  // 图片源
  imageSource?: any;
  // 标题
  title?: string;
  // 描述文本
  description?: string;
  // 按钮文本
  buttonText?: string;
  // 按钮点击事件
  onButtonPress?: () => void;
  // 自定义样式
  style?: ViewStyle;
  // 标题样式
  titleStyle?: TextStyle;
  // 描述样式
  descriptionStyle?: TextStyle;
}

// 空状态组件
const Empty: React.FC<EmptyProps> = ({
  iconName = 'inbox-outline',
  imageSource,
  title = '暂无数据',
  description = '这里什么都没有',
  buttonText,
  onButtonPress,
  style,
  titleStyle,
  descriptionStyle,
}) => {
  const theme = useTheme() as any;

  // 渲染图标或图片
  const renderIcon = () => {
    if (imageSource) {
      return (
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="contain"
        />
      );
    }

    return (
      <MaterialCommunityIcons
        name={iconName as any}
        size={80}
        color={theme.colors.placeholder}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {renderIcon()}
        {title && (
          <Text style={[styles.title, titleStyle, { color: theme.colors.text }]}>
            {title}
          </Text>
        )}
        {description && (
          <Text
            style={[styles.description, descriptionStyle, { color: theme.colors.placeholder }]}
          >
            {description}
          </Text>
        )}
        {buttonText && onButtonPress && (
          <View style={styles.buttonContainer}>
            <Button
              title={buttonText}
              type="primary"
              onPress={onButtonPress}
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
  image: {
    width: 120,
    height: 120,
    marginBottom: 16,
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

export default Empty;
