import React from 'react'
import { View, StyleSheet } from 'react-native'
import { UI } from '../../lib/ui'

type LoadingSkeletonProps = {
  styles?: any
}

/**
 * HomeScreen 骨架屏：概览卡与列表占位
 */
const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ styles }) => {
  const s = styles ?? StyleSheet.create({
    container: { paddingHorizontal: UI.space.md },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: UI.space.sm },
    card: { width: '47%', height: 80, borderRadius: UI.radius.xl, backgroundColor: '#f2f2f2' },
    list: { marginTop: UI.space.md, gap: UI.space.xs },
    item: { height: 56, borderRadius: UI.radius.md, backgroundColor: '#f2f2f2' },
  })

  return (
    <View style={s.container}>
      <View style={s.row}>
        <View style={s.card} />
        <View style={s.card} />
        <View style={s.card} />
        <View style={s.card} />
      </View>
      <View style={s.list}>
        <View style={s.item} />
        <View style={s.item} />
        <View style={s.item} />
        <View style={s.item} />
      </View>
    </View>
  )
}

export default LoadingSkeleton