// Utility functions for admin panel validation and error handling

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: ValidationError[];
}

// Common validation functions
export const validators = {
  required: (value: string, fieldName: string): string | null => {
    if (!value || value.trim().length === 0) {
      return `${fieldName} is required`;
    }
    return null;
  },

  minLength: (value: string, min: number, fieldName: string): string | null => {
    if (value && value.length < min) {
      return `${fieldName} must be at least ${min} characters long`;
    }
    return null;
  },

  maxLength: (value: string, max: number, fieldName: string): string | null => {
    if (value && value.length > max) {
      return `${fieldName} must be no more than ${max} characters long`;
    }
    return null;
  },

  email: (value: string, fieldName: string = 'Email'): string | null => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return `${fieldName} must be a valid email address`;
    }
    return null;
  },

  url: (value: string, fieldName: string = 'URL'): string | null => {
    if (value) {
      try {
        new URL(value);
        return null;
      } catch {
        return `${fieldName} must be a valid URL`;
      }
    }
    return null;
  },

  phone: (value: string, fieldName: string = 'Phone'): string | null => {
    if (value && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
      return `${fieldName} must be a valid phone number`;
    }
    return null;
  },

  number: (value: string, fieldName: string = 'Number'): string | null => {
    if (value && isNaN(Number(value))) {
      return `${fieldName} must be a valid number`;
    }
    return null;
  },

  positiveNumber: (value: string, fieldName: string = 'Number'): string | null => {
    const num = Number(value);
    if (value && (isNaN(num) || num < 0)) {
      return `${fieldName} must be a positive number`;
    }
    return null;
  }
};

// Validation schema type
export type ValidationSchema<T> = {
  [K in keyof T]?: Array<(value: string, fieldName: string) => string | null>;
};

// Generic form validator
export function validateForm<T extends Record<string, any>>(
  data: T,
  schema: ValidationSchema<T>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [field, validationRules] of Object.entries(schema)) {
    const value = String(data[field] || '');
    const fieldName = field.charAt(0).toUpperCase() + field.slice(1);

    for (const rule of validationRules as Array<(value: string, fieldName: string) => string | null>) {
      const error = rule(value, fieldName);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  }

  return errors;
}

// API error handler
export function handleApiError(error: any): string {
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred. Please try again.';
}

// Network request wrapper with error handling
export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}

// Debounce function for auto-save functionality
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Format error messages for display
export function formatErrorMessage(error: string | ValidationError[]): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (Array.isArray(error)) {
    return error.map(e => e.message).join(', ');
  }
  
  return 'An error occurred';
}

// Check if user is authenticated (client-side)
export async function checkAuthentication(): Promise<boolean> {
  try {
    const response = await fetch('/api/admin/session-check');
    const data = await response.json().catch(() => ({}));
    return response.ok && data.authenticated;
  } catch {
    return false;
  }
}

// Redirect to login if not authenticated
export async function requireAuthentication(router: any): Promise<boolean> {
  const isAuthenticated = await checkAuthentication();
  if (!isAuthenticated) {
    router.push('/admin');
    return false;
  }
  return true;
}

// Common form field props generator
export function getFieldProps(
  name: string,
  value: any,
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  errors: Record<string, string>,
  required: boolean = false
) {
  return {
    name,
    value: value || '',
    onChange,
    required,
    className: `w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[name] ? 'border-red-300 bg-red-50' : 'border-gray-300'
    }`,
    'aria-invalid': !!errors[name],
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  };
}

// Success/Error message component props
export function getMessageProps(
  type: 'success' | 'error',
  message: string
) {
  const baseClasses = 'p-4 rounded-md border';
  const typeClasses = type === 'success'
    ? 'bg-green-50 border-green-200 text-green-700'
    : 'bg-red-50 border-red-200 text-red-700';

  return {
    className: `${baseClasses} ${typeClasses}`,
    role: 'alert' as const,
    'aria-live': 'polite' as const,
    message,
    type,
  };
}

// Loading spinner component props
export function getLoadingSpinnerProps(size: 'sm' | 'md' | 'lg' = 'md') {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };
  
  return {
    className: `animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`,
    'aria-label': 'Loading',
  };
}

// Auto-save hook utility
export function createAutoSave<T>(
  saveFunction: (data: T) => Promise<void>,
  delay: number = 2000
) {
  return debounce(saveFunction, delay);
}
