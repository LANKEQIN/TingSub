import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Text } from 'tamagui'
import { Edit3, Trash2, X } from '@tamagui/lucide-icons'
import tamaguiConfig from '../../tamagui.config'
import { getVariableValue } from '@tamagui/core'

type Props = {
  visible: boolean
  styles: any
  onCancel: () => void
  onEdit: () => void
  onDelete: () => void
}

const SubscriptionActionSheet: React.FC<Props> = ({ visible, styles, onCancel, onEdit, onDelete }) => {
  if (!visible) return null
  const c = tamaguiConfig.tokens.color

  return (
    <View style={styles.modalMask}>
      <View style={[styles.modalBox, actionStyles.box]}>
        <Text style={styles.modalTitle}>选择操作</Text>
        <View style={actionStyles.actions}>
          <TouchableOpacity style={[actionStyles.actionBtn, actionStyles.editBtn]} onPress={onEdit} activeOpacity={0.8}>
            <Edit3 size={20} color="#FFFFFF" />
            <Text style={actionStyles.actionText}>编辑</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[actionStyles.actionBtn, actionStyles.deleteBtn]} onPress={onDelete} activeOpacity={0.8}>
            <Trash2 size={20} color="#FFFFFF" />
            <Text style={actionStyles.actionText}>删除</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[actionStyles.cancelBtn, { borderColor: getVariableValue(c.borderDark) }]} onPress={onCancel} activeOpacity={0.7}>
          <X size={20} color={styles.colors.textSecondary} />
          <Text style={[actionStyles.cancelText, { color: styles.colors.textSecondary }]}>取消</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const actionStyles = StyleSheet.create({
  box: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  editBtn: {
    backgroundColor: '#3B82F6',
  },
  deleteBtn: {
    backgroundColor: '#EF4444',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
})

export default SubscriptionActionSheet
