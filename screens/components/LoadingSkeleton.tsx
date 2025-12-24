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
  const skeletonBg = styles?.colors?.badgeBg ?? styles?.colors?.border ?? '#f2f2f2'
  const base = StyleSheet.create({
    container: { paddingHorizontal: UI.space.md },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: UI.space.sm },
    card: { width: '47%', height: 86, borderRadius: UI.radius.xl, backgroundColor: skeletonBg as string },
    list: { marginTop: UI.space.md, gap: UI.space.xs },
    item: { height: 56, borderRadius: UI.radius.md, backgroundColor: skeletonBg as string },
  })
  const hasAll =
    !!styles &&
    !!styles.container &&
    !!styles.row &&
    !!styles.card &&
    !!styles.list &&
    !!styles.item
  const s = hasAll ? styles : base

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
