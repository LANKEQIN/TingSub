import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text } from 'tamagui'

type Props = {
  visible: boolean
  styles: any
  onCancel: () => void
  onEdit: () => void
  onDelete: () => void
}

const SubscriptionActionSheet: React.FC<Props> = ({ visible, styles, onCancel, onEdit, onDelete }) => {
  if (!visible) return null
  return (
    <View style={styles.modalMask}>
      <View style={styles.modalBox}>
        <Text style={styles.modalTitle}>选择操作</Text>
        <View style={styles.modalActions}>
          <TouchableOpacity style={styles.btnGhost} onPress={onCancel}>
            <Text style={styles.btnGhostText}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnPrimary} onPress={onEdit}>
            <Text style={styles.btnPrimaryText}>编辑</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: '#EF4444' }]} onPress={onDelete}>
            <Text style={styles.btnPrimaryText}>删除</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default SubscriptionActionSheet