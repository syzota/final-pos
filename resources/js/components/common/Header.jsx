import React, { useState } from "react";
import logoHeader from "../../assets/images/common/logo-header.jpeg";
import userAvatar from "../../assets/images/common/kristin-cooper.jpeg";

import { Menu, X, Home, Users, BookText, CalendarDays, Calculator } from 'lucide-react';

export default function Header({ activePage = "beranda", onNavigate }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleClick = (e, pageId) => {
        e.preventDefault();
        setSidebarOpen(false);

        if (onNavigate) {
            onNavigate(pageId);
        } else {
            window.location.hash = pageId;
        }
    };

    return (
        <>
            <header className="header-navbar">
                <div className="header-content">
                    {/* KIRI: Logo */}
                    <div className="header-left">
                        <div
                            className="header-brand"
                            onClick={(e) => handleClick(e, "beranda")}
                        >
                            <img
                                src={logoHeader}
                                className="header-logo"
                                alt="Logo Posyandu"
                            />
                            <div>
                                <div className="brand-title">
                                    Posyandu Loa Duri Ulu
                                </div>
                                <div className="brand-subtitle">
                                    Layanan Masyarakat
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TENGAH: Menu Navigasi Desktop */}
                    <nav className="header-nav">
                        <a
                            href="#beranda"
                            className={`nav-item ${activePage === "beranda" ? "active" : ""}`}
                            onClick={(e) => handleClick(e, "beranda")}
                        >
                            Beranda
                        </a>
                        <a
                            href="#profil"
                            className={`nav-item ${activePage === "profil" ? "active" : ""}`}
                            onClick={(e) => handleClick(e, "profil")}
                        >
                            Profil
                        </a>
                        <a
                            href="#artikel"
                            className={`nav-item ${activePage === "artikel" ? "active" : ""}`}
                            onClick={(e) => handleClick(e, "artikel")}
                        >
                            Artikel
                        </a>
                        <a
                            href="#jadwal"
                            className={`nav-item ${activePage === "jadwal" ? "active" : ""}`}
                            onClick={(e) => handleClick(e, "jadwal")}
                        >
                            Jadwal
                        </a>
                        <a
                            href="#kalkulator"
                            className={`nav-item ${activePage === "kalkulator" ? "active" : ""}`}
                            onClick={(e) => handleClick(e, "kalkulator")}
                        >
                            Kalkulator
                        </a>
                    </nav>

                    {/* KANAN: Tombol Masuk (Desktop) & Hamburger Menu (Mobile) */}
                    <div className="header-actions">
                        <button
                            className="signin-btn desktop-only"
                            onClick={() => onNavigate("login")}
                        >
                            Masuk
                        </button>
                        <button
                            className="hamburger-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label="Menu"
                            style={{ position: 'relative', zIndex: 10001 }}
                        >
                            {sidebarOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </header>

            {/* =========================================
          DROPDOWN MODAL (Muncul saat layar HP)
          ========================================= */}

            {/* Background Gelap saat Menu Terbuka */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
                onClick={() => setSidebarOpen(false)}
            />

            <aside className={`mobile-dropdown-menu ${sidebarOpen ? "show" : ""}`}>
                <div className="mobile-dropdown-content">
                    <button
                        className={activePage === "beranda" ? "active" : ""}
                        onClick={(e) => handleClick(e, "beranda")}
                    >
                        Beranda
                    </button>
                    <button
                        className={activePage === "profil" ? "active" : ""}
                        onClick={(e) => handleClick(e, "profil")}
                    >
                        Profil
                    </button>
                    <button
                        className={activePage === "artikel" ? "active" : ""}
                        onClick={(e) => handleClick(e, "artikel")}
                    >
                        Artikel
                    </button>
                    <button
                        className={activePage === "jadwal" ? "active" : ""}
                        onClick={(e) => handleClick(e, "jadwal")}
                    >
                        Jadwal
                    </button>
                    <button
                        className={activePage === "kalkulator" ? "active" : ""}
                        onClick={(e) => handleClick(e, "kalkulator")}
                    >
                        Kalkulator
                    </button>
                    <div className="mobile-dropdown-divider"></div>
                    <button
                        className="mobile-login-btn"
                        onClick={() => {
                            setSidebarOpen(false);
                            onNavigate("login");
                        }}
                    >
                        Masuk / Login
                    </button>
                </div>
            </aside>
        </>
    );
}
