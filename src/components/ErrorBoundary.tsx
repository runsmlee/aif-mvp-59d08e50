import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('GateFirst: Render error caught by boundary', error, errorInfo);
    this.setState({ errorInfo });

    // Also push to the global error array so the inline timeout can see it
    if (typeof window !== 'undefined' && Array.isArray((window as unknown as Record<string, unknown>).__gfErrors)) {
      (window as unknown as { __gfErrors: Array<{ type: string; message: string; stack?: string; time: number }> }).__gfErrors.push({
        type: 'render_error',
        message: error.message,
        stack: error.stack || '',
        time: Date.now(),
      });
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.message || 'Unknown error';
      const errorStack = this.state.error?.stack || '';
      const componentStack = this.state.errorInfo?.componentStack || '';

      return (
        <div
          role="alert"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              background: '#FEE2E2',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
            aria-hidden="true"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#B91C1C" strokeWidth="2" />
              <path d="M12 8v4m0 4h.01" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#B91C1C',
              marginBottom: '0.5rem',
            }}
          >
            Something went wrong
          </h2>

          <p
            style={{
              fontSize: '0.875rem',
              color: '#4B5563',
              maxWidth: '28rem',
              lineHeight: 1.5,
              marginBottom: '1rem',
            }}
          >
            The application encountered an unexpected error during rendering. Details are shown below to help diagnose the issue.
          </p>

          {/* Error message */}
          <div
            style={{
              textAlign: 'left',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '0.5rem',
              padding: '1rem',
              maxWidth: '32rem',
              width: '100%',
            }}
          >
            <p
              style={{
                fontWeight: 600,
                color: '#991B1B',
                margin: '0 0 0.5rem',
                fontSize: '0.8125rem',
              }}
            >
              Error:
            </p>
            <pre
              style={{
                fontSize: '0.6875rem',
                color: '#7F1D1D',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                margin: 0,
              }}
            >
              {errorMsg}
            </pre>

            {componentStack && (
              <>
                <p
                  style={{
                    fontWeight: 600,
                    color: '#991B1B',
                    margin: '0.75rem 0 0.25rem',
                    fontSize: '0.8125rem',
                  }}
                >
                  Component stack:
                </p>
                <pre
                  style={{
                    fontSize: '0.625rem',
                    color: '#991B1B',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    margin: 0,
                    background: 'rgba(255,255,255,0.5)',
                    padding: '0.5rem',
                    borderRadius: '0.25rem',
                    overflow: 'auto',
                    maxHeight: '8rem',
                  }}
                >
                  {componentStack}
                </pre>
              </>
            )}

            {errorStack && (
              <details style={{ marginTop: '0.5rem' }}>
                <summary
                  style={{
                    fontSize: '0.6875rem',
                    color: '#991B1B',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Stack trace
                </summary>
                <pre
                  style={{
                    fontSize: '0.5625rem',
                    color: '#991B1B',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    margin: '0.25rem 0 0',
                    background: 'rgba(255,255,255,0.5)',
                    padding: '0.5rem',
                    borderRadius: '0.25rem',
                    overflow: 'auto',
                    maxHeight: '10rem',
                  }}
                >
                  {errorStack}
                </pre>
              </details>
            )}
          </div>

          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1.5rem',
              backgroundColor: '#B91C1C',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: '44px',
              minWidth: '88px',
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
