
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorDisplay } from './ErrorDisplay';
=======
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {

  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
=======
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {

    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }


  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
=======
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught error in ErrorBoundary", error, errorInfo);

  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (

        <ErrorDisplay 
          error={this.state.error}
          onReset={() => this.setState({ hasError: false, error: null })} 
        />

        <div className="text-center p-6">
          <h2 className="text-xl font-semibold mb-4">Something went wrong.</h2>
          <p className="text-red-500">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
        </div>

      );
    }

    return this.props.children;
  }

} 

}

