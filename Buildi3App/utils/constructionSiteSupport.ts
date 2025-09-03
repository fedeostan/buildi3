import { useState, useEffect, useCallback } from 'react';
import { Alert, AppState } from 'react-native';

export interface ConstructionSiteNetworkInfo {
  isConnected: boolean;
  connectionType: string;
  isExpensive: boolean;
  strength: 'poor' | 'fair' | 'good' | 'excellent';
  isOffline: boolean;
}

export interface ConstructionErrorContext {
  isCritical: boolean;
  affectsSafety: boolean;
  canWorkOffline: boolean;
  userMessage: string;
  technicalMessage: string;
  retryCount: number;
  lastAttempt: Date;
}

/**
 * Hook for construction site network detection and offline support
 * Uses simple fetch-based connectivity testing for compatibility
 */
export const useConstructionNetworkStatus = () => {
  const [networkInfo, setNetworkInfo] = useState<ConstructionSiteNetworkInfo>({
    isConnected: true,
    connectionType: 'unknown',
    isExpensive: false,
    strength: 'good',
    isOffline: false,
  });

  const [retryCount, setRetryCount] = useState(0);

  const checkConnectivity = useCallback(async () => {
    try {
      // Simple connectivity test - try to fetch a small resource
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('https://httpbin.org/status/200', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache',
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setNetworkInfo({
          isConnected: true,
          connectionType: 'network',
          isExpensive: false, // Can't determine without NetInfo
          strength: 'good', // Assume good if fetch succeeds quickly
          isOffline: false,
        });
        setRetryCount(0);
      } else {
        throw new Error('Network check failed');
      }
    } catch (error) {
      console.warn('Network connectivity check failed:', error);
      setNetworkInfo({
        isConnected: false,
        connectionType: 'none',
        isExpensive: false,
        strength: 'poor',
        isOffline: true,
      });
      setRetryCount(prev => prev + 1);
    }
  }, []);

  useEffect(() => {
    // Initial check
    checkConnectivity();
    
    // Set up periodic connectivity checks (every 30 seconds)
    const interval = setInterval(checkConnectivity, 30000);
    
    return () => clearInterval(interval);
  }, [checkConnectivity]);

  // Provide manual refresh capability
  const refreshConnectivity = useCallback(() => {
    checkConnectivity();
  }, [checkConnectivity]);

  return { ...networkInfo, refreshConnectivity, retryCount };
};

/**
 * Construction-site appropriate error handler
 */
export const createConstructionError = (
  error: any,
  context: string,
  isCritical = false,
  affectsSafety = false
): ConstructionErrorContext => {
  const isNetworkError = error?.message?.toLowerCase().includes('network') || 
                        error?.message?.toLowerCase().includes('fetch') ||
                        error?.code === 'NETWORK_ERROR';

  const canWorkOffline = !isCritical && !affectsSafety;

  let userMessage = 'Something went wrong';
  let technicalMessage = error?.message || 'Unknown error';

  if (isNetworkError) {
    userMessage = canWorkOffline 
      ? 'Poor signal detected. Working in offline mode.'
      : 'Connection required for this action. Please try again when you have better signal.';
    technicalMessage = `Network error in ${context}: ${error?.message}`;
  } else if (error?.message?.includes('unauthorized') || error?.message?.includes('forbidden')) {
    userMessage = 'You don\'t have permission for this action. Contact your site supervisor.';
    technicalMessage = `Permission error in ${context}: ${error?.message}`;
  } else if (error?.message?.includes('not found')) {
    userMessage = 'The requested item could not be found. It may have been moved or deleted.';
    technicalMessage = `Resource not found in ${context}: ${error?.message}`;
  } else {
    userMessage = isCritical 
      ? 'Critical system error. Please contact support immediately.'
      : 'Something went wrong. Your work has been saved locally and will sync when connection improves.';
  }

  return {
    isCritical,
    affectsSafety,
    canWorkOffline,
    userMessage,
    technicalMessage,
    retryCount: 0,
    lastAttempt: new Date(),
  };
};

/**
 * Construction site appropriate error display
 */
export const showConstructionError = (
  errorContext: ConstructionErrorContext,
  onRetry?: () => void,
  onContinueOffline?: () => void
) => {
  const buttons = [];

  if (onRetry) {
    buttons.push({
      text: 'Try Again',
      onPress: onRetry,
    });
  }

  if (errorContext.canWorkOffline && onContinueOffline) {
    buttons.push({
      text: 'Continue Offline',
      onPress: onContinueOffline,
      style: 'default' as const,
    });
  }

  buttons.push({
    text: 'OK',
    style: 'cancel' as const,
  });

  Alert.alert(
    errorContext.isCritical ? '🚨 Critical Error' : 
    errorContext.affectsSafety ? '⚠️ Safety Alert' : 
    '📡 Connection Issue',
    errorContext.userMessage,
    buttons,
    { 
      cancelable: !errorContext.isCritical && !errorContext.affectsSafety,
      userInterfaceStyle: 'light' // Better visibility on construction sites
    }
  );
};

/**
 * Retry mechanism with exponential backoff for construction sites
 */
export class ConstructionRetryManager {
  private retryCount = 0;
  private readonly maxRetries = 3;
  private readonly baseDelay = 1000; // 1 second
  private readonly maxDelay = 10000; // 10 seconds

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string,
    isCritical = false
  ): Promise<T> {
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await operation();
        this.retryCount = 0; // Reset on success
        return result;
      } catch (error) {
        this.retryCount = attempt + 1;

        if (attempt === this.maxRetries) {
          // Final attempt failed
          const errorContext = createConstructionError(error, context, isCritical);
          console.error(`Final retry failed in ${context}:`, {
            error: errorContext.technicalMessage,
            attempts: this.retryCount,
            context,
          });
          throw error;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          this.baseDelay * Math.pow(2, attempt),
          this.maxDelay
        );

        console.warn(`Retry ${attempt + 1}/${this.maxRetries} in ${context} after ${delay}ms:`, error?.message);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error(`Max retries exceeded in ${context}`);
  }

  getRetryCount(): number {
    return this.retryCount;
  }

  reset(): void {
    this.retryCount = 0;
  }
}

/**
 * Construction site data persistence for offline work
 */
export class ConstructionOfflineStorage {
  private static instance: ConstructionOfflineStorage;
  private pendingOperations: Array<{
    id: string;
    operation: string;
    data: any;
    timestamp: Date;
    priority: 'critical' | 'high' | 'normal' | 'low';
  }> = [];

  static getInstance(): ConstructionOfflineStorage {
    if (!ConstructionOfflineStorage.instance) {
      ConstructionOfflineStorage.instance = new ConstructionOfflineStorage();
    }
    return ConstructionOfflineStorage.instance;
  }

  queueOperation(
    operation: string,
    data: any,
    priority: 'critical' | 'high' | 'normal' | 'low' = 'normal'
  ): string {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    this.pendingOperations.push({
      id,
      operation,
      data,
      timestamp: new Date(),
      priority,
    });

    // Sort by priority (critical first) then by timestamp
    this.pendingOperations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, normal: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.timestamp.getTime() - b.timestamp.getTime();
    });

    console.log(`🔄 Queued offline operation: ${operation} (${priority} priority)`);
    return id;
  }

  async syncPendingOperations(
    networkInfo: ConstructionSiteNetworkInfo,
    executor: (operation: string, data: any) => Promise<void>
  ): Promise<void> {
    if (!networkInfo.isConnected || this.pendingOperations.length === 0) {
      return;
    }

    console.log(`🔄 Syncing ${this.pendingOperations.length} offline operations...`);

    // Don't sync if connection is too poor for non-critical operations
    const shouldSkipNonCritical = networkInfo.strength === 'poor';

    const operationsToSync = shouldSkipNonCritical 
      ? this.pendingOperations.filter(op => op.priority === 'critical' || op.priority === 'high')
      : this.pendingOperations;

    for (const operation of operationsToSync) {
      try {
        await executor(operation.operation, operation.data);
        this.removeOperation(operation.id);
        console.log(`✅ Synced offline operation: ${operation.operation}`);
      } catch (error) {
        console.error(`❌ Failed to sync operation ${operation.operation}:`, error);
        
        // If it's critical and keeps failing, alert user
        if (operation.priority === 'critical') {
          const errorContext = createConstructionError(
            error, 
            `syncing ${operation.operation}`, 
            true
          );
          showConstructionError(errorContext);
        }
        break; // Stop syncing on first error to avoid overwhelming poor connections
      }
    }
  }

  removeOperation(id: string): void {
    const index = this.pendingOperations.findIndex(op => op.id === id);
    if (index >= 0) {
      this.pendingOperations.splice(index, 1);
    }
  }

  getPendingCount(): number {
    return this.pendingOperations.length;
  }

  getCriticalPendingCount(): number {
    return this.pendingOperations.filter(op => op.priority === 'critical' || op.priority === 'high').length;
  }

  clearAll(): void {
    this.pendingOperations = [];
  }
}

/**
 * Hook for construction site app lifecycle management
 */
export const useConstructionAppLifecycle = () => {
  const [isAppActive, setIsAppActive] = useState(AppState.currentState === 'active');
  const networkInfo = useConstructionNetworkStatus();
  const offlineStorage = ConstructionOfflineStorage.getInstance();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setIsAppActive(nextAppState === 'active');
      
      // When app becomes active and we have network, try to sync
      if (nextAppState === 'active' && networkInfo.isConnected) {
        // This would be implemented by the consuming component
        console.log('🔄 App active and connected - ready to sync offline operations');
      }
    });
    
    return () => subscription?.remove();
  }, [networkInfo.isConnected]);

  return {
    isAppActive,
    networkInfo,
    offlineStorage,
    shouldPauseRealTimeUpdates: !isAppActive || !networkInfo.isConnected,
    shouldUseReducedBandwidth: networkInfo.strength === 'poor' || networkInfo.isExpensive,
  };
};

/**
 * Construction-specific loading states for better UX on sites
 */
export const ConstructionLoadingMessages = {
  connecting: 'Connecting to server...',
  syncing: 'Syncing your latest changes...',
  saving: 'Saving your work...',
  loading: 'Loading construction data...',
  uploading: 'Uploading to secure servers...',
  processing: 'Processing your request...',
  offline: 'Working offline - changes will sync automatically',
  poorSignal: 'Poor signal detected - using cached data',
  noSignal: 'No signal - working with saved data',
};