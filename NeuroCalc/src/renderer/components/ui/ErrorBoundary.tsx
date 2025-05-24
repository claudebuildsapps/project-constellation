import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

const ErrorContainer = styled.div`
  padding: 32px 24px;
  text-align: center;
  background: ${props => props.theme.colors.background.secondary};
  border: 1px solid ${props => props.theme.colors.status.error + '30'};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin: 16px;
`;

const ErrorIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.status.error};
`;

const ErrorTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 12px 0;
`;

const ErrorMessage = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.text.secondary};
  margin: 0 0 24px 0;
  line-height: ${props => props.theme.typography.lineHeight.relaxed};
`;

const ErrorActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  ${props => props.variant === 'primary' ? `
    background: ${props.theme.colors.primary[500]};
    color: white;
    
    &:hover {
      background: ${props.theme.colors.primary[600]};
      transform: translateY(-1px);
      box-shadow: ${props.theme.shadows.md};
    }
  ` : `
    background: ${props.theme.colors.background.tertiary};
    color: ${props.theme.colors.text.primary};
    border: 1px solid ${props.theme.colors.border.medium};
    
    &:hover {
      background: ${props.theme.colors.background.primary};
      border-color: ${props.theme.colors.border.dark};
    }
  `}
  
  &:active {
    transform: translateY(0);
  }
`;

const ErrorDetails = styled.details`
  margin-top: 24px;
  text-align: left;
  
  summary {
    color: ${props => props.theme.colors.text.tertiary};
    font-size: ${props => props.theme.typography.fontSize.sm};
    cursor: pointer;
    margin-bottom: 12px;
    
    &:hover {
      color: ${props => props.theme.colors.text.secondary};
    }
  }
`;

const ErrorStack = styled.pre`
  background: ${props => props.theme.colors.background.tertiary};
  border: 1px solid ${props => props.theme.colors.border.light};
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: 12px;
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
`;

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Report error to external service if configured
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Store error details for debugging
    try {
      localStorage.setItem('neurocalc_last_error', JSON.stringify({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        componentStack: errorInfo.componentStack
      }));
    } catch (e) {
      console.warn('Failed to store error details:', e);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleReportError = () => {
    const errorData = {
      message: this.state.error?.message || 'Unknown error',
      stack: this.state.error?.stack || 'No stack trace',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };
    
    // Copy error details to clipboard for easy reporting
    navigator.clipboard.writeText(JSON.stringify(errorData, null, 2))
      .then(() => {
        alert('Error details copied to clipboard. Please share this information when reporting the issue.');
      })
      .catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = JSON.stringify(errorData, null, 2);
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Error details copied to clipboard. Please share this information when reporting the issue.');
      });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>
            NeuroCalc encountered an unexpected error. This might be a temporary issue 
            that can be resolved by trying again.
          </ErrorMessage>
          
          <ErrorActions>
            <ActionButton variant="primary" onClick={this.handleRetry}>
              Try Again
            </ActionButton>
            <ActionButton onClick={this.handleReload}>
              Reload Application
            </ActionButton>
            <ActionButton onClick={this.handleReportError}>
              Copy Error Details
            </ActionButton>
          </ErrorActions>
          
          <ErrorDetails>
            <summary>Technical Details</summary>
            <ErrorStack>
              <strong>Error:</strong> {this.state.error?.message || 'Unknown error'}
              {this.state.error?.stack && (
                <>
                  <br /><br />
                  <strong>Stack Trace:</strong>
                  <br />
                  {this.state.error.stack}
                </>
              )}
            </ErrorStack>
          </ErrorDetails>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;