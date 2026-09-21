import React from 'react';
import PageHero from '../common/PageHero';
import { Home01Icon, ArrowRight01Icon } from '@theexperiencecompany/gaia-icons/solid-rounded';
import heroImg from '../../assets/images/common/hero-beranda.png';

export default function WelcomeBanner({ onNavigate }) {
  return (
    <PageHero
      badgeIcon={Home01Icon}
      badgeText="Beranda"
      title="Tempat Nyaman untuk Menjaga Kesehatan"
      titleHighlight="Keluarga Anda"
      description="Pusat informasi jadwal kegiatan, edukasi gizi, dan layanan posyandu Desa Loa Duri Ulu."
      primaryAction={{
        label: 'Lihat Jadwal Posyandu',
        icon: ArrowRight01Icon,
        onClick: () => onNavigate && onNavigate('jadwal'),
      }}
      secondaryAction={{
        label: 'Kenali Posyandu',
        onClick: () => onNavigate && onNavigate('profil'),
      }}
      bgImage={heroImg}
    />
  );
}