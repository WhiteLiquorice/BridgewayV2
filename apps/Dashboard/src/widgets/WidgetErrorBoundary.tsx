import React from 'react'

export default class WidgetErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[WidgetErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-gray-900 border border-red-500/20 rounded-xl p-5 flex flex-col items-center justify-center gap-3 min-h-[100px]">
          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-white">Widget failed to load</p>
            <p className="text-xs text-gray-500 mt-0.5">An unexpected error occurred</p>
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="text-xs font-medium text-brand hover:text-brand bg-brand/10 hover:bg-brand/20 px-3 py-1.5 rounded-lg transition-colors border border-brand/20"
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
