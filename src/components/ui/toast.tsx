'use client';

import * as React from 'react';
import { toast as sonnerToast, Toaster } from 'sonner';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  XCircle, 
  X,
  Filter,
  Eye,
  RotateCcw
} from 'lucide-react';
import { getCssVariable } from '@/lib/executive/theme-bridge';

// Toast types and configuration
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

// Custom toast component with neumorphic styling
const CustomToast = ({ 
  type, 
  title, 
  description, 
  onDismiss,
  action
}: {
  type: ToastType;
  title?: string;
  description?: string;
  onDismiss?: () => void;
  action?: { label: string; onClick: () => void };
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'loading':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
          />
        );
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-500';
      case 'error':
        return 'border-red-500';
      case 'warning':
        return 'border-orange-500';
      case 'info':
        return 'border-blue-500';
      case 'loading':
        return 'border-blue-500';
      default:
        return 'border-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={`
        relative flex items-start gap-3 p-4 max-w-md rounded-[var(--neumorphic-radius-lg)]
        bg-[var(--neumorphic-card)] shadow-[var(--neumorphic-shadow-convex)]
        border-l-4 ${getBorderColor()}
        backdrop-blur-md
      `}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        {title && (
          <div className="text-sm font-semibold text-[var(--neumorphic-text-primary)] mb-1">
            {title}
          </div>
        )}
        {description && (
          <div className="text-sm text-[var(--neumorphic-text-secondary)] leading-relaxed">
            {description}
          </div>
        )}
        
        {action && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className="mt-2 text-sm font-medium text-[var(--neumorphic-accent)] hover:underline"
          >
            {action.label}
          </motion.button>
        )}
      </div>
      
      {onDismiss && (
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded-full hover:bg-[var(--neumorphic-text-secondary)] hover:bg-opacity-10 transition-colors"
        >
          <X className="w-4 h-4 text-[var(--neumorphic-text-secondary)]" />
        </motion.button>
      )}
    </motion.div>
  );
};

// Enhanced toast functions with better UX
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    return sonnerToast.custom((t) => (
      <CustomToast
        type="success"
        title={options?.title || 'Success'}
        description={message}
        onDismiss={() => sonnerToast.dismiss(t)}
        action={options?.action}
      />
    ), {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
    });
  },

  error: (message: string, options?: ToastOptions) => {
    return sonnerToast.custom((t) => (
      <CustomToast
        type="error"
        title={options?.title || 'Error'}
        description={message}
        onDismiss={() => sonnerToast.dismiss(t)}
        action={options?.action}
      />
    ), {
      duration: options?.duration || 6000,
      position: options?.position || 'top-right',
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    return sonnerToast.custom((t) => (
      <CustomToast
        type="warning"
        title={options?.title || 'Warning'}
        description={message}
        onDismiss={() => sonnerToast.dismiss(t)}
        action={options?.action}
      />
    ), {
      duration: options?.duration || 5000,
      position: options?.position || 'top-right',
    });
  },

  info: (message: string, options?: ToastOptions) => {
    return sonnerToast.custom((t) => (
      <CustomToast
        type="info"
        title={options?.title || 'Info'}
        description={message}
        onDismiss={() => sonnerToast.dismiss(t)}
        action={options?.action}
      />
    ), {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
    });
  },

  loading: (message: string, options?: ToastOptions) => {
    return sonnerToast.custom((t) => (
      <CustomToast
        type="loading"
        title={options?.title || 'Loading'}
        description={message}
        onDismiss={() => sonnerToast.dismiss(t)}
        action={options?.action}
      />
    ), {
      duration: options?.duration || Infinity,
      position: options?.position || 'top-right',
    });
  },

  // Specialized dashboard toasts
  filterApplied: (filterName: string, count: number) => {
    return toast.info(`Showing ${count} items`, {
      title: 'Filter Applied',
      description: `${filterName} filter is now active`,
      action: {
        label: 'Clear Filter',
        onClick: () => {
          toast.info('Filter cleared');
        }
      }
    });
  },

  filterCleared: () => {
    return toast.success('All filters have been cleared', {
      title: 'Filters Reset',
    });
  },

  dataRefreshed: () => {
    return toast.success('Dashboard data has been updated', {
      title: 'Data Refreshed',
    });
  },

  selectionMade: (entityType: string, entityName: string) => {
    return toast.info(`Now viewing details for ${entityName}`, {
      title: `${entityType} Selected`,
      action: {
        label: 'View Details',
        onClick: () => {
          // This would typically navigate or focus the detail panel
        }
      }
    });
  },

  riskAlert: (entityName: string, riskScore: number) => {
    return toast.warning(`Risk score: ${riskScore}%`, {
      title: `High Risk Detected: ${entityName}`,
      action: {
        label: 'Review Details',
        onClick: () => {
          // Navigate to risk review
        }
      }
    });
  },

  networkConnection: (supplierName: string, connectionCount: number) => {
    return toast.info(`Found ${connectionCount} related entities`, {
      title: `Network Analysis: ${supplierName}`,
      action: {
        label: 'Explore Network',
        onClick: () => {
          // Focus network graph
        }
      }
    });
  },

  exportStarted: (exportType: string) => {
    const toastId = toast.loading(`Preparing ${exportType} export...`);
    
    // Simulate export progress
    setTimeout(() => {
      sonnerToast.dismiss(toastId);
      toast.success(`${exportType} export completed`, {
        title: 'Export Ready',
        action: {
          label: 'Download',
          onClick: () => {
            // Trigger download
          }
        }
      });
    }, 3000);
  },

  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId);
  },

  dismissAll: () => {
    return sonnerToast.dismiss();
  },
};

// Toast Provider component with neumorphic styling
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        expand={true}
        richColors={false}
        closeButton={false}
        toastOptions={{
          style: {
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
            padding: 0,
          },
          className: 'toast-custom',
        }}
        theme="light" // We handle theming through CSS variables
      />
    </>
  );
};

// Hook for easy toast access
export const useToast = () => {
  return {
    toast,
    dismiss: toast.dismiss,
    dismissAll: toast.dismissAll,
  };
};