import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';
import { 
  CheckmarkCircle01Icon, 
  AlertCircleIcon, 
  Cancel01Icon,
  InformationCircleIcon,
  HelpCircleIcon
} from '@theexperiencecompany/gaia-icons/solid-rounded';

/**
 * Universal NotificationModal Component
 * Provides clean, high-clarity modal feedback for success, error, warning, info, and confirm states.
 * 
 * Props:
 * - isOpen: boolean
 * - type: 'success' | 'error' | 'danger' | 'warning' | 'info' | 'confirm'
 * - title: string (optional)
 * - message: string | ReactNode
 * - details: string[] | string (optional bullet points of missing/incomplete fields or errors)
 * - onClose: () => void
 * - isConfirm: boolean (if true, shows Batal + Confirm buttons)
 * - onConfirm: () => void
 * - confirmText: string (default 'Mengerti' or 'Ya, Lanjutkan')
 * - confirmVariant: 'primary' | 'danger' | 'teal'
 * - cancelText: string (default 'Batal')
 * - autoClose: number (optional auto close timer in ms)
 */
export default function NotificationModal({
  isOpen,
  type = 'success',
  title,
  message,
  details = null,
  onClose,
  isConfirm = false,
  onConfirm,
  confirmText,
  confirmVariant,
  cancelText = 'Batal',
  autoClose = 0,
}) {
  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    let timer;
    if (autoClose > 0 && onClose && !isConfirm) {
      timer = setTimeout(() => {
        onClose();
      }, autoClose);
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, autoClose, onClose, isConfirm]);

  if (!isOpen || (!message && !title && !details)) return null;

  const isConfirmation = isConfirm || type === 'confirm';
  const isError = type === 'error' || type === 'danger';
  const isWarning = type === 'warning';
  const isInfo = type === 'info';
  const isSuccess = !isError && !isWarning && !isInfo && !isConfirmation;

  const defaultTitle = isSuccess
    ? 'Berhasil Disimpan!'
    : isError
    ? 'Perhatian: Terjadi Kendala'
    : isConfirmation
    ? 'Konfirmasi Tindakan'
    : isWarning
    ? 'Peringatan Sistem'
    : 'Informasi Penting';

  const displayTitle = title || defaultTitle;

  const theme = isSuccess
    ? {
        badgeBg: '#dcfce7',
        badgeBorder: '#bbf7d0',
        badgeColor: '#16a34a',
        buttonVariant: 'primary',
        glow: 'rgba(22, 163, 74, 0.2)',
        icon: CheckmarkCircle01Icon,
      }
    : isError
    ? {
        badgeBg: '#fee2e2',
        badgeBorder: '#fecaca',
        badgeColor: '#dc2626',
        buttonVariant: 'danger',
        glow: 'rgba(220, 38, 38, 0.2)',
        icon: AlertCircleIcon,
      }
    : isConfirmation
    ? {
        badgeBg: '#fff7ed',
        badgeBorder: '#fed7aa',
        badgeColor: '#ea580c',
        buttonVariant: confirmVariant || 'danger',
        glow: 'rgba(234, 88, 12, 0.2)',
        icon: HelpCircleIcon,
      }
    : isWarning
    ? {
        badgeBg: '#fef3c7',
        badgeBorder: '#fde68a',
        badgeColor: '#d97706',
        buttonVariant: 'accent',
        glow: 'rgba(217, 119, 6, 0.2)',
        icon: AlertCircleIcon,
      }
    : {
        badgeBg: '#e0f2fe',
        badgeBorder: '#bae6fd',
        badgeColor: '#0284c7',
        buttonVariant: 'primary',
        glow: 'rgba(2, 132, 199, 0.2)',
        icon: InformationCircleIcon,
      };

  const IconComponent = theme.icon;
  const resolvedConfirmText = confirmText || (isConfirmation ? 'Ya, Lanjutkan' : 'Mengerti');

  const modalContent = (
    <div
      className="notification-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
    >
      <div
        className="notification-modal-card"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '430px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '32px 24px 24px',
          boxShadow: `0 24px 48px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05), 0 0 32px ${theme.glow}`,
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
            width: '68px',
            height: '68px',
            borderRadius: '22px',
            backgroundColor: theme.badgeBg,
            border: `1.5px solid ${theme.badgeBorder}`,
            color: theme.badgeColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px',
            boxShadow: `0 8px 20px -4px ${theme.glow}`,
          }}
        >
          <IconComponent size={36} />
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '18.5px',
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
        {message && (
          <div
            style={{
              fontSize: '14px',
              color: '#475569',
              fontWeight: 500,
              lineHeight: 1.55,
              margin: '0 0 16px 0',
              maxWidth: '360px',
              wordBreak: 'break-word',
            }}
          >
            {message}
          </div>
        )}

        {/* Multi-point Incomplete/Error Details if any */}
        {Array.isArray(details) && details.length > 0 && (
          <div
            style={{
              width: '100%',
              backgroundColor: isError ? '#fef2f2' : '#f8fafc',
              border: `1px solid ${isError ? '#fecaca' : '#e2e8f0'}`,
              borderRadius: '12px',
              padding: '12px 14px',
              textAlign: 'left',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: isError ? '#991b1b' : '#334155', marginBottom: '6px' }}>
              Poin yang perlu diperiksa:
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: isError ? '#b91c1c' : '#475569', lineHeight: '1.5' }}>
              {details.map((point, idx) => (
                <li key={idx} style={{ marginBottom: idx === details.length - 1 ? 0 : '4px' }}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons (Stacked) */}
        <div style={{ width: '100%', marginTop: '8px' }}>
          {isConfirmation ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Button
                type="button"
                variant={theme.buttonVariant}
                size="lg"
                fullWidth
                onClick={() => {
                  if (onConfirm) onConfirm();
                  if (onClose) onClose();
                }}
                style={{
                  minHeight: '46px',
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '14.5px',
                }}
              >
                {resolvedConfirmText}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                fullWidth
                onClick={onClose}
                style={{
                  minHeight: '44px',
                  borderRadius: '14px',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                {cancelText}
              </Button>
            </div>
          ) : (
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
              {resolvedConfirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
