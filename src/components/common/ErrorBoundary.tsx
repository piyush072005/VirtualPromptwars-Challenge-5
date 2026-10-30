import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled exception:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          role="alert" 
          aria-live="assertive"
          className="min-h-[400px] flex items-center justify-center p-6"
        >
          <div className="glass-panel max-w-lg w-full p-8 rounded-2xl border border-rose-500/40 bg-surface-950/90 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-display font-bold text-white">
              Application State Interrupted
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              An unexpected payload error occurred while rendering this module. Our self-healing safeguards captured the exception to prevent data loss.
            </p>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-surface-900 border border-slate-800 text-left overflow-x-auto text-[11px] font-mono text-rose-300">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-glow-brand transition-all focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reload & Recover State
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
