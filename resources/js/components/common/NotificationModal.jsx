import React, { useEffect } from 'react';
import Button from './Button';
import { 
  CheckmarkCircle01Icon, 
  AlertCircleIcon, 
  Cancel01Icon,
  InformationCircleIcon 
} from '@theexperiencecompany/gaia-icons/solid-rounded';

/**
 * Universal NotificationModal Component
 * Provides clean, high-clarity modal feedback for success, error, warning, and info states.
 * 
 * Props:
 * - isOpen: boolean
 * - type: 'success' | 'error' | 'warning' | 'info'
 * - title: string (optional)
 * - message: string | ReactNode
 * - onClose: () => void
 * - confirmText: string (default 'Mengerti')
 * - autoClose: number (optional auto close timer in ms)
 */
export default function NotificationModal({
  isOpen,
  type = 'success',
  title,
  message,
  onClose,
  confirmText = 'Mengerti',
  autoClose = 0,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    let timer;
    if (autoClose > 0 && onClose) {
      timer = setTimeout(() => {
        onClose();
      }, autoClose);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, autoClose, onClose]);

  if (!isOpen || !message) return null;

  const isError = type === 'error' || type === 'danger';
  const isWarning = type === 'warning';
  const isInfo = type === 'info';
  const isSuccess = !isError && !isWarning && !isInfo;

  const defaultTitle = isSuccess
    ? 'Berhasil!'
    : isError
    ? 'Terjadi Kendala'
    : isWarning
    ? 'Perhatian'
    : 'Informasi Sistem';

  const displayTitle = title || defaultTitle;

  const theme = isSuccess
    ? {
        badgeBg: '#ecfdf5',
        badgeBorder: '#a7f3d0',
        badgeColor: '#059669',
        buttonVariant: 'primary',
        glow: 'rgba(16, 185, 129, 0.15)',
      }
    : isError
    ? {
        badgeBg: '#fef2f2',
        badgeBorder: '#fecaca',
        badgeColor: '#dc2626',
        buttonVariant: 'danger',
        glow: 'rgba(239, 68, 68, 0.15)',
      }
    : isWarning
    ? {
        badgeBg: '#fffbeb',
        badgeBorder: '#fde68a',
        badgeColor: '#d97706',
        buttonVariant: 'accent',
        glow: 'rgba(245, 158, 11, 0.15)',
      }
    : {
        badgeBg: '#f0f9ff',
        badgeBorder: '#bae6fd',
        badgeColor: '#0284c7',
        buttonVariant: 'primary',
        glow: 'rgba(14, 165, 233, 0.15)',
      };

  return (
    <div
      className="notification-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div
        className="notification-modal-card"
        role="dialog"
        aria-modal="true"
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '32px 24px 24px',
          boxShadow: `0 24px 48px -12px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.04), 0 0 32px ${theme.glow}`,
          textAlign: 'center',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'modalPop 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Close Icon Button (Top Right) */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup notifikasi"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#f1f5f9',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e2e8f0';
              e.currentTarget.style.color = '#0f172a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <Cancel01Icon size={16} />
          </button>
        )}

        {/* Status Graphic / Icon Badge */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            backgroundColor: theme.badgeBg,
            border: `1.5px solid ${theme.badgeBorder}`,
            color: theme.badgeColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            boxShadow: `0 8px 16px -4px ${theme.glow}`,
          }}
        >
          {isSuccess ? (
            <CheckmarkCircle01Icon size={34} />
          ) : isError ? (
            <AlertCircleIcon size={34} />
          ) : isWarning ? (
            <AlertCircleIcon size={34} />
          ) : (
            <InformationCircleIcon size={34} />
          )}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '19px',
            fontWeight: 800,
            color: '#0f172a',
            margin: '0 0 10px 0',
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
          }}
        >
          {displayTitle}
        </h3>

        {/* Message Description */}
        <div
          style={{
            fontSize: '14px',
            color: '#475569',
            fontWeight: 500,
            lineHeight: 1.55,
            margin: '0 0 24px 0',
            maxWidth: '340px',
            wordBreak: 'break-word',
          }}
        >
          {message}
        </div>

        {/* Action Button */}
        <div style={{ width: '100%' }}>
          <Button
            type="button"
            variant={theme.buttonVariant}
            size="lg"
            fullWidth
            onClick={onClose}
            style={{
              minHeight: '46px',
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '14.5px',
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
