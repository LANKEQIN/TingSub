import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { UI } from '../../lib/ui'
import { Inbox } from '@tamagui/lucide-icons'

type EmptyStateProps = {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  styles?: any
  icon?: React.ReactNode
}

/**
 * 通用空态组件：用于列表或模块在无数据时的友好展示
 */
const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionLabel, onAction, styles, icon }) => {
  const colors = styles?.colors
  const s = StyleSheet.create({
    container: { paddingHorizontal: UI.space.md },
    box: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: UI.space.lg,
      borderRadius: UI.radius.lg,
      borderWidth: 1,
      borderColor: colors?.border ?? '#eee',
      backgroundColor: colors?.cardBg ?? '#fff',
    },
    illo: {
      width: 84,
      height: 84,
      borderRadius: UI.radius.round,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors?.iconBg ?? '#f3f4f6',
      marginBottom: UI.space.md,
    },
    title: { fontSize: 18, fontWeight: '700', marginBottom: UI.space.xs, color: colors?.textPrimary ?? '#111' },
    desc: { fontSize: 13, color: colors?.textSecondary ?? '#666', marginBottom: UI.space.sm, textAlign: 'center' },
    btn: { paddingHorizontal: UI.space.md, paddingVertical: UI.space.sm, borderRadius: UI.radius.xs, backgroundColor: colors?.fabBg ?? '#2563EB' },
    btnText: { color: '#fff', fontWeight: '700' },
  })

  return (
    <View style={s.container}>
      <View style={s.box}>
        <View style={s.illo}>
          {icon ?? <Inbox size={34} color={colors?.textSecondary ?? '#666'} />}
        </View>
        <Text style={s.title}>{title}</Text>
        {description && <Text style={s.desc}>{description}</Text>}
        {actionLabel && onAction && (
          <TouchableOpacity style={s.btn} onPress={onAction}>
            <Text style={s.btnText}>{actionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default EmptyState