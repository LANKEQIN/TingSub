import React from 'react';
import {
  StyleSheet,
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from './Button';

// 模态框Props接口
export interface ModalProps {
  // 是否显示
  visible: boolean;
  // 关闭事件
  onClose: () => void;
  // 标题
  title?: string;
  // 内容
  children: React.ReactNode;
  // 确认按钮文本
  confirmText?: string;
  // 取消按钮文本
  cancelText?: string;
  // 确认按钮点击事件
  onConfirm?: () => void;
  // 是否显示确认按钮
  showConfirm?: boolean;
  // 是否显示取消按钮
  showCancel?: boolean;
  // 自定义样式
  containerStyle?: ViewStyle;
  // 内容样式
  contentStyle?: ViewStyle;
  // 标题样式
  titleStyle?: TextStyle;
}

// 模态框组件
const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  showConfirm = true,
  showCancel = true,
  containerStyle,
  contentStyle,
  titleStyle,
}) => {
  const theme = useTheme() as any;

  const screenHeight = Dimensions.get('window').height;

  // 处理确认按钮点击
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  // 渲染头部
  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={[styles.title, titleStyle, { color: theme.colors.text }]}>
          {title}
        </Text>
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons
            name="close"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>
    );
  };

  // 渲染底部按钮
  const renderFooter = () => {
    if (!showConfirm && !showCancel) return null;

    return (
      <View style={styles.footer}>
        {showCancel && (
          <Button
            title={cancelText}
            type="secondary"
            onPress={onClose}
            style={styles.button}
          />
        )}
        {showConfirm && (
          <Button
            title={confirmText}
            type="primary"
            onPress={handleConfirm}
            style={styles.button}
          />
        )}
      </View>
    );
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: theme.colors.backdrop }]}>
        <View
          style={[
            styles.container,
            { maxHeight: screenHeight * 0.8 },
            containerStyle,
          ]}
        >
          {title && renderHeader()}
          <View style={[styles.content, contentStyle]}>{children}</View>
          {renderFooter()}
        </View>
      </View>
    </RNModal>
  );
};

// 样式定义
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    gap: 12,
  },
  button: {
    minWidth: 88,
  },
});

export default Modal;
