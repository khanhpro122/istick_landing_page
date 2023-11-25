import React, { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error or send it to an error tracking service
    // console.error('Error:', error);
    // console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render a fallback UI or an error component here
      return <div>Something went wrong.</div>;
    }

    // Render the children components as normal
    return this.props.children;
  }
}

export default ErrorBoundary;