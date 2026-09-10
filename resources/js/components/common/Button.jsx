import React from 'react';

/**
 * Universal Button component with strict mobile ergonomics,
 * semantic color tokens, integrated loading spinner, and touch-target standards.
 */
export default function Button({
  as: Component,
  href,
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  iconOnly = false,
  loading = false,
  loadingText,
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  style = {},
  ...rest
}) {
  const isDisabled = disabled || loading;
  const Tag = Component || (href ? 'a' : 'button');

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
      case 'teal':
        return {
          backgroundColor: 'var(--primary-teal, #008080)',
          color: '#ffffff',
          border: '1.5px solid var(--primary-teal, #008080)',
          boxShadow: '0 2px 8px rgba(0, 128, 128, 0.2)',
        };
      case 'secondary':
      case 'outline':
        return {
          backgroundColor: '#ffffff',
          color: '#334155',
          border: '1.5px solid #cbd5e1',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        };
      case 'danger':
        return {
          backgroundColor: '#dc2626',
          color: '#ffffff',
          border: '1.5px solid #dc2626',
          boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)',
        };
      case 'danger-outline':
      case 'danger-soft':
        return {
          backgroundColor: '#fff1f2',
          color: '#e11d48',
          border: '1.5px solid #fecdd3',
        };
      case 'success':
        return {
          backgroundColor: '#16a34a',
          color: '#ffffff',
          border: '1.5px solid #16a34a',
          boxShadow: '0 2px 8px rgba(22, 163, 74, 0.2)',
        };
      case 'cyan':
        return {
          backgroundColor: 'var(--cyan-deep, #0E7C93)',
          color: '#ffffff',
          border: '1.5px solid var(--cyan-deep, #0E7C93)',
          boxShadow: '0 2px 8px rgba(14, 124, 147, 0.2)',
        };
      case 'magenta':
        return {
          backgroundColor: 'var(--magenta-deep, #93348A)',
          color: '#ffffff',
          border: '1.5px solid var(--magenta-deep, #93348A)',
          boxShadow: '0 2px 8px rgba(147, 52, 138, 0.2)',
        };
      case 'orange':
        return {
          backgroundColor: 'var(--orange-deep, #B5650C)',
          color: '#ffffff',
          border: '1.5px solid var(--orange-deep, #B5650C)',
          boxShadow: '0 2px 8px rgba(181, 101, 12, 0.2)',
        };
      case 'rose':
        return {
          backgroundColor: 'var(--rose-deep, #93000A)',
          color: '#ffffff',
          border: '1.5px solid var(--rose-deep, #93000A)',
          boxShadow: '0 2px 8px rgba(147, 0, 10, 0.2)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: '#475569',
          border: '1.5px solid transparent',
        };
      default:
        return {
          backgroundColor: 'var(--primary-teal, #008080)',
          color: '#ffffff',
          border: '1.5px solid var(--primary-teal, #008080)',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          minHeight: '36px',
          height: '36px',
          padding: iconOnly ? '0' : '0 12px',
          width: iconOnly ? '36px' : undefined,
          fontSize: '12px',
          borderRadius: '8px',
          gap: '6px',
          iconSize: 14,
        };
      case 'lg':
        return {
          minHeight: '48px',
          height: '48px',
          padding: iconOnly ? '0' : '0 24px',
          width: iconOnly ? '48px' : undefined,
          fontSize: '15px',
          borderRadius: '12px',
          gap: '10px',
          iconSize: 20,
        };
      case 'md':
      default:
        return {
          minHeight: '44px',
          height: '44px',
          padding: iconOnly ? '0' : '0 18px',
          width: iconOnly ? '44px' : undefined,
          fontSize: '13.5px',
          borderRadius: '10px',
          gap: '8px',
          iconSize: 16,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  const combinedStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontFamily: 'inherit',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.6 : 1,
    width: fullWidth ? '100%' : (iconOnly ? sizeStyles.width : 'auto'),
    transition: 'transform 0.1s ease, background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
    boxSizing: 'border-box',
    outline: 'none',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    textDecoration: 'none',
    ...sizeStyles,
    ...variantStyles,
    ...style,
  };

  return (
    <Tag
      href={href}
      type={Tag === 'button' ? type : undefined}
      disabled={Tag === 'button' ? isDisabled : undefined}
      onClick={isDisabled ? (e) => e.preventDefault() : onClick}
      className={`app-btn app-btn-${variant} app-btn-${size} ${className}`}
      style={combinedStyles}
      aria-busy={loading ? 'true' : undefined}
      {...rest}
    >
      {loading ? (
        <>
          <span
            style={{
              display: 'inline-block',
              width: `${sizeStyles.iconSize}px`,
              height: `${sizeStyles.iconSize}px`,
              border: '2px solid currentColor',
              borderRightColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
              flexShrink: 0,
            }}
          />
          {!iconOnly && (
            <span>{loadingText || (children ? 'Memproses...' : '')}</span>
          )}
        </>
      ) : (
        <>
          {Icon && <Icon size={sizeStyles.iconSize} style={{ flexShrink: 0 }} />}
          {!iconOnly && children && <span>{children}</span>}
          {IconRight && <IconRight size={sizeStyles.iconSize} style={{ flexShrink: 0 }} />}
        </>
      )}
    </Tag>
  );
}
