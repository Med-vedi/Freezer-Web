import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Button, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Something went wrong"
                    color="red"
                    variant="filled"
                >
                    <Stack gap="md">
                        <Text>
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </Text>
                        <Button
                            leftSection={<IconRefresh size={16} />}
                            onClick={this.handleRetry}
                            variant="light"
                            color="red"
                        >
                            Try again
                        </Button>
                    </Stack>
                </Alert>
            );
        }

        return this.props.children;
    }
}
