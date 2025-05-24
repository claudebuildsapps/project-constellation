import React, { Suspense, lazy } from 'react';
import styled from 'styled-components';

// Loading fallback component
const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  min-height: 200px;
`;

const LoadingSpinner = styled.div`
  border: 3px solid ${props => props.theme.colors.border.light};
  border-top: 3px solid ${props => props.theme.colors.primary[500]};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  margin-left: 16px;
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`;

const LoadingFallback: React.FC<{ message?: string }> = ({ message = "Loading..." }) => (
  <LoadingContainer>
    <LoadingSpinner />
    <LoadingText>{message}</LoadingText>
  </LoadingContainer>
);

// Lazy-loaded components
export const LazyDoseResponseChart = lazy(() => 
  import('./charts/DoseResponseChart').then(module => ({ default: module.default }))
);

export const LazyTimelineChart = lazy(() => 
  import('./charts/TimelineChart').then(module => ({ default: module.default }))
);

export const LazyNeurotransmitterDashboard = lazy(() => 
  import('./charts/NeurotransmitterDashboard').then(module => ({ default: module.default }))
);

export const LazySettingsView = lazy(() => 
  import('./SettingsView').then(module => ({ default: module.default }))
);

export const LazyHelpSystem = lazy(() => 
  import('./HelpSystem').then(module => ({ default: module.default }))
);

export const LazyAboutView = lazy(() => 
  import('./AboutView').then(module => ({ default: module.default }))
);

export const LazySafetyDisclaimer = lazy(() => 
  import('./SafetyDisclaimer').then(module => ({ default: module.default }))
);

export const LazyEmergencyHelp = lazy(() => 
  import('./EmergencyHelp').then(module => ({ default: module.default }))
);

// Higher-order component for lazy loading with custom fallback
export function withLazyLoading<P extends {}>(
  LazyComponent: React.LazyExoticComponent<React.ComponentType<P>>,
  fallbackMessage?: string
) {
  return function LazyWrapper(props: P) {
    return (
      <Suspense fallback={<LoadingFallback message={fallbackMessage} />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Preload function for critical components
export const preloadComponents = async () => {
  // Preload heavy chart components in the background
  const chartImports = [
    import('./charts/DoseResponseChart'),
    import('./charts/TimelineChart'),
    import('./charts/NeurotransmitterDashboard'),
  ];

  try {
    await Promise.all(chartImports);
    console.log('Chart components preloaded successfully');
  } catch (error) {
    console.warn('Failed to preload some chart components:', error);
  }
};

// Component wrappers with optimized loading
export const DoseResponseChart = withLazyLoading(LazyDoseResponseChart, "Loading dose-response chart...");
export const TimelineChart = withLazyLoading(LazyTimelineChart, "Loading timeline visualization...");
export const NeurotransmitterDashboard = withLazyLoading(LazyNeurotransmitterDashboard, "Loading neurotransmitter dashboard...");
export const SettingsView = withLazyLoading(LazySettingsView, "Loading settings...");
export const HelpSystem = withLazyLoading(LazyHelpSystem, "Loading help system...");
export const AboutView = withLazyLoading(LazyAboutView, "Loading about page...");
export const SafetyDisclaimer = withLazyLoading(LazySafetyDisclaimer, "Loading safety information...");
export const EmergencyHelp = withLazyLoading(LazyEmergencyHelp, "Loading emergency resources...");

// Export loading fallback for reuse
export { LoadingFallback };