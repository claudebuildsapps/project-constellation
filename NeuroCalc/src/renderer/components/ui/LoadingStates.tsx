import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const dots = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

// Spinner Components
const SpinnerContainer = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => {
    switch (props.size) {
      case 'sm': return '16px';
      case 'lg': return '32px';
      default: return '24px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'sm': return '16px';
      case 'lg': return '32px';
      default: return '24px';
    }
  }};
`;

const SpinnerRing = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  width: 100%;
  height: 100%;
  border: 2px solid ${props => props.theme.colors.border.light};
  border-top: 2px solid ${props => props.theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const DotSpinner = styled.div`
  display: inline-flex;
  gap: 4px;
`;

const Dot = styled.div<{ delay: number }>`
  width: 8px;
  height: 8px;
  background: ${props => props.theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${dots} 1.4s infinite ease-in-out both;
  animation-delay: ${props => props.delay}s;
`;

// Skeleton Components
const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.background.tertiary} 0%,
    ${props => props.theme.colors.border.light} 50%,
    ${props => props.theme.colors.background.tertiary} 100%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  border-radius: ${props => props.theme.borderRadius.sm};
`;

const SkeletonText = styled(SkeletonBase)<{ width?: string; height?: string }>`
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '1em'};
  margin: 4px 0;
`;

const SkeletonCard = styled(SkeletonBase)`
  width: 100%;
  height: 120px;
  margin-bottom: 12px;
  border-radius: ${props => props.theme.borderRadius.lg};
`;

const SkeletonAvatar = styled(SkeletonBase)<{ size?: number }>`
  width: ${props => props.size || 40}px;
  height: ${props => props.size || 40}px;
  border-radius: 50%;
`;

// Loading Overlay
const LoadingOverlay = styled.div.withConfig({
  shouldForwardProp: (prop) => !['transparent'].includes(prop),
})<{ transparent?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => 
    props.transparent 
      ? 'rgba(255, 255, 255, 0.8)'
      : props.theme.colors.background.overlay
  };
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  backdrop-filter: blur(2px);
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  max-width: 300px;
  text-align: center;
`;

const LoadingText = styled.div`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const LoadingSubtext = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-top: -8px;
`;

// Component Interfaces
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  type?: 'ring' | 'dots';
}

interface SkeletonProps {
  width?: string;
  height?: string;
  lines?: number;
  avatar?: boolean;
  avatarSize?: number;
}

interface LoadingOverlayProps {
  message?: string;
  submessage?: string;
  transparent?: boolean;
  spinner?: SpinnerProps;
}

// Spinner Component
export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', type = 'ring' }) => {
  if (type === 'dots') {
    return (
      <DotSpinner>
        <Dot delay={0} />
        <Dot delay={0.16} />
        <Dot delay={0.32} />
      </DotSpinner>
    );
  }

  return (
    <SpinnerContainer size={size}>
      <SpinnerRing size={size} />
    </SpinnerContainer>
  );
};

// Skeleton Component
export const Skeleton: React.FC<SkeletonProps> = ({ 
  width, 
  height, 
  lines = 1, 
  avatar = false, 
  avatarSize = 40 
}) => {
  if (avatar) {
    return <SkeletonAvatar size={avatarSize} />;
  }

  if (lines === 1) {
    return <SkeletonText width={width} height={height} />;
  }

  return (
    <div>
      {Array.from({ length: lines }, (_, i) => (
        <SkeletonText 
          key={i}
          width={i === lines - 1 ? '75%' : width}
          height={height}
        />
      ))}
    </div>
  );
};

// Card Skeleton Component
export const SkeletonSubstanceCard: React.FC = () => (
  <div style={{ padding: '16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
      <Skeleton avatar avatarSize={48} />
      <div style={{ flex: 1 }}>
        <Skeleton width="60%" height="18px" />
        <Skeleton width="40%" height="14px" />
      </div>
    </div>
    <Skeleton lines={2} height="14px" />
    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
      <Skeleton width="60px" height="20px" />
      <Skeleton width="80px" height="20px" />
      <Skeleton width="70px" height="20px" />
    </div>
  </div>
);

// Effect Display Skeleton
export const SkeletonEffectDisplay: React.FC = () => (
  <div style={{ padding: '24px' }}>
    <Skeleton width="200px" height="24px" />
    <div style={{ marginTop: '24px' }}>
      <Skeleton width="150px" height="16px" />
      <div style={{ margin: '12px 0' }}>
        <Skeleton height="120px" />
      </div>
    </div>
    <div style={{ marginTop: '32px' }}>
      <Skeleton width="180px" height="16px" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '12px' }}>
        <Skeleton height="80px" />
        <Skeleton height="80px" />
        <Skeleton height="80px" />
      </div>
    </div>
  </div>
);

// Loading Overlay Component
export const LoadingOverlayComponent: React.FC<LoadingOverlayProps> = ({ 
  message = 'Loading...', 
  submessage,
  transparent = false,
  spinner = { size: 'lg', type: 'ring' }
}) => (
  <LoadingOverlay transparent={transparent}>
    <LoadingContent>
      <Spinner {...spinner} />
      <LoadingText>{message}</LoadingText>
      {submessage && <LoadingSubtext>{submessage}</LoadingSubtext>}
    </LoadingContent>
  </LoadingOverlay>
);

// Higher-order component for loading states
interface WithLoadingProps {
  loading?: boolean;
  error?: string | null;
  loadingMessage?: string;
  loadingSubmessage?: string;
  skeleton?: React.ComponentType;
}

export const withLoading = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & WithLoadingProps> => {
  return ({ loading, error, loadingMessage, loadingSubmessage, skeleton: SkeletonComponent, ...props }) => {
    if (error) {
      return (
        <div style={{ 
          padding: '24px', 
          textAlign: 'center',
          color: '#ef4444'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚠️</div>
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>Error</div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>{error}</div>
        </div>
      );
    }

    if (loading) {
      if (SkeletonComponent) {
        return <SkeletonComponent />;
      }
      return (
        <LoadingOverlayComponent 
          message={loadingMessage}
          submessage={loadingSubmessage}
          transparent
        />
      );
    }

    return <Component {...(props as P)} />;
  };
};

// Progress Bar Component
const ProgressContainer = styled.div`
  width: 100%;
  height: 4px;
  background: ${props => props.theme.colors.background.tertiary};
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressBar = styled.div.withConfig({
  shouldForwardProp: (prop) => !['progress', 'animated'].includes(prop),
})<{ progress: number; animated?: boolean }>`
  height: 100%;
  background: ${props => props.theme.colors.primary[500]};
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
  ${props => props.animated && `
    background: linear-gradient(
      90deg,
      ${props.theme.colors.primary[400]},
      ${props.theme.colors.primary[600]},
      ${props.theme.colors.primary[400]}
    );
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s ease-in-out infinite;
  `}
`;

interface ProgressProps {
  progress: number;
  animated?: boolean;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ progress, animated = false, className }) => (
  <ProgressContainer className={className}>
    <ProgressBar progress={Math.max(0, Math.min(100, progress))} animated={animated} />
  </ProgressContainer>
);

export default {
  Spinner,
  Skeleton,
  SkeletonSubstanceCard,
  SkeletonEffectDisplay,
  LoadingOverlay: LoadingOverlayComponent,
  withLoading,
  Progress
};