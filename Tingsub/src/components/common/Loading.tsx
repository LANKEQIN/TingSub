import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  ViewStyle,
  Modal as RNModal,
} from 'react-native';
import { useTheme } from 'react-native-paper';

// 加载类型
export type LoadingType = 'inline' | 'overlay' | 'screen';

// 加载Props接口
export interface LoadingProps {
  // 是否显示
  visible: boolean;
  // 加载文本
  text?: string;
  // 加载类型
  type?: LoadingType;
  // 自定义样式
  style?: ViewStyle;
  // 指示器大小
  size?: 'small' | 'large' | number;
}

// 加载组件
const Loading: React.FC<LoadingProps> = ({
  visible,
  text,
  type = 'inline',
  style,
  size = 'large',
}) => {
  const theme = useTheme() as any;

  // 渲染内联加载
  const renderInline = () => {
    if (!visible) return null;

    return (
      <View style={[styles.inlineContainer, style]}>
        <ActivityIndicator
          size={size}
          color={theme.colors.primary}
        />
        {text && (
          <Text style={[styles.text, { color: theme.colors.text }]}>
            {text}
          </Text>
        )}
      </View>
    );
  };

  // 渲染遮罩加载
  const renderOverlay = () => {
    if (!visible) return null;

    return (
      <RNModal
        visible={visible}
        transparent
        animationType="fade"
      >
        <View style={[styles.overlay, { backgroundColor: theme.colors.backdrop }]}>
          <View style={[styles.overlayContent, style]}>
            <ActivityIndicator
              size={size}
              color={theme.colors.primary}
            />
            {text && (
              <Text style={[styles.text, { color: theme.colors.text }]}>
                {text}
              </Text>
            )}
          </View>
        </View>
      </RNModal>
    );
  };

  // 渲染全屏加载
  const renderScreen = () => {
    if (!visible) return null;

    return (
      <View style={[styles.screenContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator
          size={size}
          color={theme.colors.primary}
        />
        {text && (
          <Text style={[styles.text, { color: theme.colors.text }]}>
            {text}
          </Text>
        )}
      </View>
    );
  };

  // 根据类型渲染
  switch (type) {
    case 'inline':
      return renderInline();
    case 'overlay':
      return renderOverlay();
    case 'screen':
      return renderScreen();
    default:
      return renderInline();
  }
};

// 样式定义
const styles = StyleSheet.create({
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Loading;
