import React from 'react';
import PageHero from '../common/PageHero';
import heroBgPattern from '../../assets/images/profil/hero-bg-pattern.jpg';
import { FavouriteIcon, UserGroupIcon } from '@theexperiencecompany/gaia-icons/solid-rounded';

export default function ProfilHeroBanner() {
  return (
    <PageHero
      badgeIcon={UserGroupIcon}
      badgeText="Profil Posyandu"
      title="Melayani dengan Hati untuk Keluarga Sehat"
      titleHighlight="Desa Loa Duri Ulu"
      description="Garda terdepan pendampingan kesehatan keluarga dan balita Desa Loa Duri Ulu."
      stats={[
        { icon: FavouriteIcon, label: '9 Posyandu Aktif' },
        { icon: UserGroupIcon, label: 'Kader & Tenaga Medis Siaga' },
      ]}
      bgImage={heroBgPattern}
    />
  );
}