import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import styled from 'styled-components';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  onScroll?: (scrollTop: number) => void;
  className?: string;
}

const ListContainer = styled.div<{ height: number }>`
  height: ${props => props.height}px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
`;

const ListInner = styled.div<{ height: number }>`
  height: ${props => props.height}px;
  position: relative;
`;

const ListItem = styled.div<{ top: number; height: number }>`
  position: absolute;
  top: ${props => props.top}px;
  left: 0;
  right: 0;
  height: ${props => props.height}px;
  overflow: hidden;
`;

function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  onScroll,
  className,
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight)
    );

    const startIndex = Math.max(0, start - overscan);
    const endIndex = Math.min(items.length - 1, end + overscan);

    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Handle scroll events
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = event.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    onScroll?.(newScrollTop);
  }, [onScroll]);

  // Render visible items
  const visibleItems = useMemo(() => {
    const result = [];
    for (let i = visibleRange.startIndex; i <= visibleRange.endIndex; i++) {
      if (items[i]) {
        result.push(
          <ListItem
            key={i}
            top={i * itemHeight}
            height={itemHeight}
          >
            {renderItem(items[i], i)}
          </ListItem>
        );
      }
    }
    return result;
  }, [items, visibleRange, itemHeight, renderItem]);

  const totalHeight = items.length * itemHeight;

  return (
    <ListContainer
      ref={containerRef}
      height={containerHeight}
      onScroll={handleScroll}
      className={className}
    >
      <ListInner height={totalHeight}>
        {visibleItems}
      </ListInner>
    </ListContainer>
  );
}

export default VirtualizedList;

// Hook for managing virtualized list state
export function useVirtualizedList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback((scrollTop: number) => {
    setScrollTop(scrollTop);
    setIsScrolling(true);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set new timeout to detect end of scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.ceil((scrollTop + containerHeight) / itemHeight);
    return { start, end };
  }, [scrollTop, itemHeight, containerHeight]);

  return {
    scrollTop,
    isScrolling,
    visibleRange,
    handleScroll,
  };
}

// Optimized list item component
interface OptimizedListItemProps {
  children: React.ReactNode;
  isVisible?: boolean;
}

export const OptimizedListItem = React.memo<OptimizedListItemProps>(({ children, isVisible = true }) => {
  if (!isVisible) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }
  return <>{children}</>;
});

OptimizedListItem.displayName = 'OptimizedListItem';