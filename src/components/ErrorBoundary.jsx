import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message ?? 'Unknown error' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#0f172a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
          }}
        >
          <div
            style={{
              background: '#1e293b',
              border: '1px solid #ef4444',
              borderRadius: '16px',
              padding: '32px 40px',
              textAlign: 'center',
              maxWidth: '400px',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⚠️</div>
            <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>
              Something went wrong
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>
              {this.state.message}
            </div>
            <button
              onClick={() => this.setState({ hasError: false, message: '' })}
              style={{
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 20px',
                fontSize: '0.875rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
