import React from 'react';
import { StyleSheet, View, ViewStyle, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { useTheme } from 'react-native-paper';

// 卡片Props接口
export interface CardProps {
  // 卡片内容
  children: React.ReactNode;
  // 是否可点击
  pressable?: boolean;
  // 点击事件
  onPress?: (event: GestureResponderEvent) => void;
  // 自定义样式
  style?: ViewStyle;
  // 内边距
  padding?: number;
  // 外边距
  margin?: number;
  // 圆角半径
  borderRadius?: number;
  // 是否显示阴影
  elevation?: number;
}

// 卡片组件
const Card: React.FC<CardProps> = ({
  children,
  pressable = false,
  onPress,
  style,
  padding = 16,
  margin = 12,
  borderRadius = 12,
  elevation = 2,
}) => {
  const theme = useTheme();

  // 获取卡片样式
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.card,
      backgroundColor: theme.colors.surface,
      padding,
      margin,
      borderRadius,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation,
    };

    return baseStyle;
  };

  // 渲染内容
  const renderContent = () => {
    return <View style={[getCardStyle(), style]}>{children}</View>;
  };

  // 如果可点击，使用TouchableOpacity包裹
  if (pressable && onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[getCardStyle(), style]}>
        {children}
      </TouchableOpacity>
    );
  }

  return renderContent();
};

// 样式定义
const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});

export default Card;
