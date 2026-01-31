export const SERVICE_CONFIG = {
  visa: import.meta.env.VITE_SERVICE_VISA === 'true',
  housing: import.meta.env.VITE_SERVICE_HOUSING === 'true',
  jobs: import.meta.env.VITE_SERVICE_JOBS === 'true',
  driving: import.meta.env.VITE_SERVICE_DRIVING === 'true',
} as const;