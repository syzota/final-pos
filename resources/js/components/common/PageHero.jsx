import React from 'react';
import defaultHeroBg from '../../assets/images/common/hero-beranda.png';

/**
 * Standardized PageHero Component
 * Digunakan secara seragam di seluruh halaman publik (Beranda, Profil, Jadwal, Artikel, Kalkulator, Kontak)
 */
export default function PageHero({
  badgeIcon: BadgeIcon,
  badgeText,
  title,
  titleHighlight,
  description,
  primaryAction,
  secondaryAction,
  stats = [],
  bgImage = defaultHeroBg,
  extraContent,
}) {
  return (
    <section className="page-hero">
      {/* Background with uniform teal-tinted overlay */}
      <div className="page-hero__bg-wrapper">
        <img
          src={bgImage}
          alt=""
          className="page-hero__bg-img"
          loading="lazy"
        />
      </div>
      <div className="page-hero__overlay"></div>

      {/* Hero Content */}
      <div className="page-hero__content">
        {/* Eyebrow Badge with Soft Ice Blue Accent */}
        {badgeText && (
          <div className="page-hero__badge">
            {BadgeIcon && <BadgeIcon size={16} />}
            <span>{badgeText}</span>
          </div>
        )}

        {/* Unified Headline */}
        <h1 className="page-hero__title">
          {title}
          {titleHighlight && (
            <>
              {' '}
              <span
                className="page-hero__title-highlight"
                style={{
                  fontFamily: 'var(--font-headline, "Quicksand", sans-serif)',
                  fontWeight: 800,
                  display: 'inline'
                }}
              >
                {titleHighlight}
              </span>
            </>
          )}
        </h1>

        {/* Friendly Citizen Lead Description */}
        {description && (
          <p className="page-hero__description">
            {description}
          </p>
        )}

        {/* Action Buttons (Primary CTA & Secondary Soft CTA) */}
        {(primaryAction || secondaryAction) && (
          <div className="page-hero__actions">
            {primaryAction && (
              <button
                type="button"
                className="page-hero__btn-primary"
                onClick={primaryAction.onClick}
              >
                <span>{primaryAction.label}</span>
                {primaryAction.icon && <primaryAction.icon size={18} />}
              </button>
            )}

            {secondaryAction && (
              <button
                type="button"
                className="page-hero__btn-secondary"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.icon && <secondaryAction.icon size={18} />}
                <span>{secondaryAction.label}</span>
              </button>
            )}
          </div>
        )}

        {/* Stats or Highlight Pills (e.g. Profil & Layanan) */}
        {stats && stats.length > 0 && (
          <div className="page-hero__stats">
            {stats.map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <div className="page-hero__stat-item" key={idx}>
                  {StatIcon && <StatIcon size={16} />}
                  <span>{stat.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {extraContent}
      </div>
    </section>
  );
}
