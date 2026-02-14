import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-8">
                    <div className="max-w-2xl w-full bg-red-900/20 border border-red-500/50 rounded-xl p-8">
                        <h1 className="text-3xl font-bold text-red-400 mb-4">Something went wrong</h1>
                        <p className="text-gray-300 mb-6">The application crashed. Here are the details:</p>

                        <div className="bg-black/50 p-4 rounded-lg overflow-auto mb-6">
                            <code className="text-red-300 font-mono text-sm block mb-2">
                                {this.state.error && this.state.error.toString()}
                            </code>
                            <pre className="text-gray-500 text-xs font-mono">
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
