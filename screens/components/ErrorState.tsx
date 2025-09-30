import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { UI } from '../../lib/ui'

type ErrorStateProps = {
  message?: string
  onRetry?: () => void
  styles?: any
}

/**
 * 通用错误态组件：展示错误信息与重试动作
 */
const ErrorState: React.FC<ErrorStateProps> = ({ message = '页面出现错误', onRetry, styles }) => {
  const s = styles ?? StyleSheet.create({
    container: { padding: UI.space.md },
    box: { alignItems: 'center', justifyContent: 'center', padding: UI.space.lg },
    title: { fontSize: 16, fontWeight: '700', marginBottom: UI.space.xs },
    desc: { fontSize: 13, color: '#666', marginBottom: UI.space.sm },
    btn: { paddingHorizontal: UI.space.md, paddingVertical: UI.space.sm, borderRadius: UI.radius.xs, backgroundColor: '#2563EB' },
    btnText: { color: '#fff', fontWeight: '700' },
  })

  return (
    <View style={[s.container]}>
      <View style={[s.box]}>
        <Text style={s.title}>出错了</Text>
        <Text style={s.desc}>{message}</Text>
        {onRetry && (
          <TouchableOpacity style={s.btn} onPress={onRetry}>
            <Text style={s.btnText}>重试</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default ErrorState