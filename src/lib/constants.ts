// File upload validation constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

// Product status options
export const PRODUCT_STATUS = {
  ACTIVE: 'ACTIVE',
  DRAFT: 'DRAFT',
  ARCHIVED: 'ARCHIVED',
} as const;

export const PRODUCT_STATUS_LABELS = {
  [PRODUCT_STATUS.ACTIVE]: 'Ativo',
  [PRODUCT_STATUS.DRAFT]: 'Rascunho',
  [PRODUCT_STATUS.ARCHIVED]: 'Arquivado',
};

// Admin session duration
export const ADMIN_SESSION_DURATION_MS = 1000 * 60 * 60 * 8; // 8 hours
