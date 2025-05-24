import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary';
  }>;
  persistent?: boolean;
}

interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

// Animations
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
  pointer-events: none;
`;

const NotificationCard = styled.div.withConfig({
  shouldForwardProp: (prop) => !['type', 'isExiting'].includes(prop),
})<{ type: NotificationType; isExiting?: boolean }>`
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'success': return props.theme.colors.accent[500];
      case 'error': return props.theme.colors.status.error;
      case 'warning': return props.theme.colors.status.warning;
      case 'info': return props.theme.colors.primary[500];
      default: return props.theme.colors.border.medium;
    }
  }};
  padding: 16px;
  pointer-events: auto;
  animation: ${props => props.isExiting ? slideOut : slideIn} 0.3s ease-out;
  max-width: 100%;
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
`;

const NotificationIcon = styled.div<{ type: NotificationType }>`
  font-size: 20px;
  line-height: 1;
  color: ${props => {
    switch (props.type) {
      case 'success': return props.theme.colors.accent[500];
      case 'error': return props.theme.colors.status.error;
      case 'warning': return props.theme.colors.status.warning;
      case 'info': return props.theme.colors.primary[500];
      default: return props.theme.colors.text.secondary;
    }
  }};
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.h4`
  margin: 0 0 4px 0;
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  word-wrap: break-word;
`;

const NotificationMessage = styled.p`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  line-height: ${props => props.theme.typography.lineHeight.normal};
  word-wrap: break-word;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

const NotificationButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 6px 12px;
  border: none;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  
  ${props => props.variant === 'primary' ? `
    background: ${props.theme.colors.primary[500]};
    color: white;
    
    &:hover {
      background: ${props.theme.colors.primary[600]};
    }
  ` : `
    background: ${props.theme.colors.background.tertiary};
    color: ${props.theme.colors.text.primary};
    border: 1px solid ${props.theme.colors.border.medium};
    
    &:hover {
      background: ${props.theme.colors.background.primary};
    }
  `}
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.tertiary};
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  font-size: 16px;
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.background.tertiary};
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const getNotificationIcon = (type: NotificationType): string => {
  switch (type) {
    case 'success': return '✅';
    case 'error': return '❌';
    case 'warning': return '⚠️';
    case 'info': return 'ℹ️';
    default: return 'ℹ️';
  }
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());

  const addNotification = useCallback((notification: Omit<Notification, 'id'>): string => {
    const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? (notification.persistent ? undefined : 5000)
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after duration
    if (newNotification.duration && !newNotification.persistent) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setExitingIds(prev => new Set(prev).add(id));
    
    // Remove from DOM after animation
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
      setExitingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300);
  }, []);

  const clearAll = useCallback(() => {
    notifications.forEach(notification => {
      removeNotification(notification.id);
    });
  }, [notifications, removeNotification]);

  const contextValue: NotificationContextValue = {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer>
        {notifications.map(notification => (
          <NotificationCard
            key={notification.id}
            type={notification.type}
            isExiting={exitingIds.has(notification.id)}
          >
            <NotificationHeader>
              <NotificationIcon type={notification.type}>
                {getNotificationIcon(notification.type)}
              </NotificationIcon>
              <NotificationContent>
                <NotificationTitle>{notification.title}</NotificationTitle>
                {notification.message && (
                  <NotificationMessage>{notification.message}</NotificationMessage>
                )}
              </NotificationContent>
              <CloseButton onClick={() => removeNotification(notification.id)}>
                ×
              </CloseButton>
            </NotificationHeader>
            
            {notification.actions && notification.actions.length > 0 && (
              <NotificationActions>
                {notification.actions.map((action, index) => (
                  <NotificationButton
                    key={index}
                    variant={action.variant || 'secondary'}
                    onClick={() => {
                      action.action();
                      if (!notification.persistent) {
                        removeNotification(notification.id);
                      }
                    }}
                  >
                    {action.label}
                  </NotificationButton>
                ))}
              </NotificationActions>
            )}
          </NotificationCard>
        ))}
      </NotificationContainer>
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Convenience hooks for specific notification types
export const useNotificationHelpers = () => {
  const { addNotification } = useNotifications();

  return {
    showSuccess: (title: string, message?: string, options?: Partial<Notification>) =>
      addNotification({ type: 'success', title, message, ...options }),
    
    showError: (title: string, message?: string, options?: Partial<Notification>) =>
      addNotification({ type: 'error', title, message, ...options }),
    
    showWarning: (title: string, message?: string, options?: Partial<Notification>) =>
      addNotification({ type: 'warning', title, message, ...options }),
    
    showInfo: (title: string, message?: string, options?: Partial<Notification>) =>
      addNotification({ type: 'info', title, message, ...options })
  };
};

export default NotificationProvider;