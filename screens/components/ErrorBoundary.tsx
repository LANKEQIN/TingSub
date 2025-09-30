import React from 'react'

type ErrorBoundaryProps = {
  fallback: React.ReactNode
  resetKeys?: any[]
  children: React.ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

/**
 * 简易错误边界：捕获子树渲染错误并显示兜底 UI
 * 支持通过 resetKeys 变化来重置错误状态
 */
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, info: any) {
    // 可接入日志上报
    // console.error('ErrorBoundary caught:', error, info)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys } = this.props
    if (!resetKeys) return
    const prev = prevProps.resetKeys || []
    const next = resetKeys || []
    const changed = prev.length !== next.length || prev.some((v, i) => v !== next[i])
    if (changed && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children as React.ReactElement
  }
}