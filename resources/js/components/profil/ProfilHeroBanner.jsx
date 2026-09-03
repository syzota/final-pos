import React from 'react';
import PageHero from '../common/PageHero';
import heroBgPattern from '../../assets/images/profil/hero-bg-pattern.jpg';
import { Heart, Users } from 'lucide-react';

export default function ProfilHeroBanner() {
  return (
    <PageHero
      badgeIcon={Users}
      badgeText="Profil Posyandu"
      title="Melayani dengan Hati untuk Keluarga Sehat"
      titleHighlight="Desa Loa Duri Ulu"
      description="Garda terdepan pendampingan kesehatan keluarga dan balita Desa Loa Duri Ulu."
      stats={[
        { icon: Heart, label: '9 Posyandu Aktif' },
        { icon: Users, label: 'Kader & Tenaga Medis Siaga' },
      ]}
      bgImage={heroBgPattern}
    />
  );
}