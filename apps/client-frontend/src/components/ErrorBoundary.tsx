import React, { Component } from "react";

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  // This updates the hasError state whenever an error appears. This is necessary because it's how we know when we have to return the error page.
  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  // componentDidCatch gets called after an error appears from a child component
  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center flex-col min-h-screen gap-11 text-center bg-muted">
          <div className="bg-card flex flex-col items-center p-5 rounded-3xl w-4/5 md:w-1/2">
            <span className="mb-5 text-2xl font-semibold tracking-tight text-foreground">
              Synth<span className="text-primary">Tree</span>
            </span>
            <h1 className="text-4xl">It seems something went wrong...</h1>

            <h2 className="text-xl mb-10 mt-10 2xl:mt-0 text-muted-foreground">
              And it's not your fault!
            </h2>

            <h3 className="mx-4 mb-10 text-muted-foreground">
              Please try refreshing the page or returning home. If the issue
              persists, please contact support.
            </h3>
            <button
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-3xl hover:bg-primary transition-all"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
            <button
              className="mt-4 px-6 py-2 text-muted-foreground hover:text-primary-foreground rounded-3xl hover:bg-accent border-2 transition-all"
              onClick={() => (window.location.href = "/")}
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
