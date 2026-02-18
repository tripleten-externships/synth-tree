import React, { Component } from "react";

import skillTreeImg from "../../assets/skilltree.svg";

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
        <div className="flex items-center justify-center flex-col min-h-screen gap-11 text-center bg-gray-400">
          <div className="bg-white flex flex-col items-center p-5 rounded-3xl w-4/5 md:w-1/2">
            <img
              className="w-14 sm:max-w-xs mb-5"
              src={skillTreeImg}
              alt="SkillTree Logo"
            />
            <h1 className="text-4xl">It seems something went wrong...</h1>

            <h2 className="text-xl mb-10 mt-10 2xl:mt-0 text-gray-400">
              And it's not your fault!
            </h2>

            <h3 className="mx-4 mb-10 text-gray-500">
              Please try refreshing the page or returning home. If the issue
              persists, please contact support.
            </h3>
            <button
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600 transition-all"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
            <button
              className="mt-4 px-6 py-2 text-gray hover:text-white rounded-3xl hover:bg-gray-500 border-2 transition-all"
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
