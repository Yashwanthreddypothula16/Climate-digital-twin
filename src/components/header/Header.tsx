import React, { useState, useEffect } from 'react';
import { Menu, Bell, Settings, HelpCircle, User } from 'lucide-react';
import { NavItem } from './NavItem';
import type { NavigationTab } from '../../types/climate';
import {
  H_HEIGHT, H_PAD_X, H_BG, H_BORDER, H_SHADOW, H_BLUR,
  LOGO_D, LOGO_GAP, LOGO_BORDER, LOGO_SHADOW,
  T_FAMILY, T_SIZE, T_WEIGHT, T_LH, T_LS, T_COLOR,
  S_SIZE, S_WEIGHT, S_LH, S_LS, S_COLOR,
  ICO_SZ, ICO_STR, ICO_COL, ICO_HOV, ICO_GAP,
  CLK_T_SZ, CLK_T_W, CLK_T_COL,
  CLK_D_SZ, CLK_D_W, CLK_D_COL,
  DIV_COL,
  NAV_ITEMS, NAV_GAP,
} from './headerConstants';

// ── Thin vertical divider ─────────────────────────────────────────────────────
const VDiv: React.FC = () => (
  <div style={{
    width: 1, height: 14,
    background: DIV_COL,
    flexShrink: 0,
    margin: '0 2px',
  }} />
);

// ── Icon button ───────────────────────────────────────────────────────────────
interface IcoProps {
  onClick?: () => void;
  title: string;
  hasDot?: boolean;
  children: React.ReactNode;
}
const Ico: React.FC<IcoProps> = ({ onClick, title, hasDot, children }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      position: 'relative',
      width: 24, height: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'transparent',
      border: 'none',
      borderRadius: 4,
      cursor: 'pointer',
      color: ICO_COL,
      flexShrink: 0,
      transition: 'color 0.15s ease',
      padding: 0,
    }}
    onMouseEnter={e => (e.currentTarget.style.color = ICO_HOV)}
    onMouseLeave={e => (e.currentTarget.style.color = ICO_COL)}
  >
    {children}
    {hasDot && (
      <span style={{
        position: 'absolute', top: 3, right: 3,
        width: 5, height: 5, borderRadius: '50%',
        background: '#EF4444',
        boxShadow: '0 0 4px rgba(239,68,68,0.8)',
        border: '1px solid #05101A',
      }} />
    )}
  </button>
);

// ── Header ────────────────────────────────────────────────────────────────────
interface HeaderProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  selectedDistrictId?: string;
  onSelectDistrict?: (id: string) => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenSettings = () => { },
}) => {
  const [timeStr, setTimeStr] = useState('12:45 PM');
  const [dateStr, setDateStr] = useState('17 May 2024');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
      setDateStr(now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      style={{
        // ── exact dimensions ─────────────────────────────────────────────
        width: '100%',
        height: H_HEIGHT,
        minHeight: H_HEIGHT,
        maxHeight: H_HEIGHT,
        flexShrink: 0,
        boxSizing: 'border-box' as const,
        overflow: 'hidden',
        // ── layout ──────────────────────────────────────────────────────
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${H_PAD_X}px`,
        // ── cosmetics ───────────────────────────────────────────────────
        background: H_BG,
        backdropFilter: H_BLUR,
        WebkitBackdropFilter: H_BLUR,
        borderBottom: '1px solid rgba(0, 240, 255, 0.1)',
        boxShadow: H_SHADOW,
        zIndex: 50,
        fontFamily: T_FAMILY,
      }}
    >

      {/* ══ LEFT — Menu · Emblem · Brand ════════════════════════════════ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}>

        {/* Hamburger ≡ */}
        <button
          style={{
            display: 'flex', alignItems: 'center',
            padding: '2px',
            marginLeft: 0, 
            marginRight: 16, // compressed from 24
            background: 'transparent', border: 'none',
            cursor: 'pointer', color: ICO_COL,
            borderRadius: 3, transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = ICO_HOV)}
          onMouseLeave={e => (e.currentTarget.style.color = ICO_COL)}
        >
          <Menu size={20} strokeWidth={ICO_STR} />
        </button>

        {/* Government Emblem */}
        <div
          onClick={() => onSelectTab('DASHBOARD')}
          style={{
            width: LOGO_D,     
            height: LOGO_D,
            minWidth: LOGO_D,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            background: 'rgba(0, 160, 255, 0.04)',
            border: `1px solid rgba(0, 160, 255, 0.1)`,
            boxShadow: LOGO_SHADOW,
          }}
        >
          {/* Kakatiya Pillar SVG */}
          <svg viewBox="0 0 72 72" style={{ width: 20, height: 20 }}>
            <circle cx="36" cy="36" r="33" fill="none" stroke="#F5AA00" strokeWidth="1.5" />
            <path d="M14 57 L14 31 Q14 13 36 13 Q58 13 58 31 L58 57"
              fill="none" stroke="#FBBC00" strokeWidth="3" strokeLinecap="round" />
            <path d="M21 57 L21 33 Q21 20 36 20 Q51 20 51 33 L51 57"
              fill="none" stroke="#F5AA00" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="33" y="37" width="6" height="20" rx="1" fill="#FBBC00" />
            <circle cx="36" cy="29" r="3" fill="#FBBC00" />
            <rect x="21" y="46" width="5" height="11" rx="1" fill="#F5AA00" />
            <rect x="46" y="46" width="5" height="11" rx="1" fill="#F5AA00" />
            <path d="M21 39 Q36 35 51 39" fill="none" stroke="#F5AA00" strokeWidth="1" />
          </svg>
        </div>

        {/* Brand text */}
        <div
          onClick={() => onSelectTab('DASHBOARD')}
          style={{
            marginLeft: LOGO_GAP,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            justifyContent: 'center',
          }}
        >
          {/* "CLIMATE DIGITAL TWIN" */}
          <span style={{
            fontFamily: T_FAMILY,
            fontSize: T_SIZE,
            fontWeight: T_WEIGHT,
            lineHeight: `${T_LH}px`,
            letterSpacing: T_LS,
            color: T_COLOR,
            textTransform: 'uppercase',
            display: 'block',
          }}>
            CLIMATE DIGITAL TWIN
          </span>
          {/* "TELANGANA STATE, INDIA" */}
          <span style={{
            fontFamily: T_FAMILY,
            fontSize: S_SIZE,
            fontWeight: S_WEIGHT,
            lineHeight: `${S_LH}px`,
            letterSpacing: S_LS,
            color: S_COLOR,
            textTransform: 'uppercase',
            display: 'block',
          }}>
            TELANGANA STATE, INDIA
          </span>
        </div>
      </div>

      {/* ══ CENTER — Navigation (Left-aligned) ══════════════════════════ */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        marginLeft: 32, // compressed from 48
        gap: NAV_GAP, // compressed to 20
      }}>
        {NAV_ITEMS.map(tab => (
          <NavItem
            key={tab}
            label={tab === 'MODEL_PERFORMANCE' ? 'MODEL EVAL' : tab}
            isActive={activeTab === (tab as NavigationTab)}
            onClick={() => onSelectTab(tab as NavigationTab)}
          />
        ))}
      </nav>

      {/* ══ SPACER ═════════════════════════════════════════════════════ */}
      <div style={{ flex: 1 }} />

      {/* ══ RIGHT — Divider · Clock · Icons ════════════════════════════ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        
        {/* Subtle Vertical Divider */}
        <div style={{
          width: 1,
          height: 24,
          background: 'rgba(255, 255, 255, 0.1)',
          marginRight: 16, // compressed from 20
        }} />

        {/* Clock — right-aligned, two lines */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 0,
          marginRight: 16, // compressed from 24
        }}>
          <span style={{
            fontFamily: T_FAMILY,
            fontSize: CLK_T_SZ,
            fontWeight: CLK_T_W,
            color: CLK_T_COL,
            lineHeight: 1,
            letterSpacing: '0.02em',
          }}>
            {timeStr}
          </span>
          <span style={{
            fontFamily: T_FAMILY,
            fontSize: CLK_D_SZ,
            fontWeight: CLK_D_W,
            color: CLK_D_COL,
            lineHeight: 1,
            letterSpacing: '0.02em',
            marginTop: 3,
          }}>
            {dateStr}
          </span>
        </div>

        {/* Icons Group */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: ICO_GAP, // compressed to 12
        }}>
          {/* Bell */}
          <Ico onClick={() => onSelectTab('ALERTS')} title="Alerts" hasDot>
            <Bell size={ICO_SZ} strokeWidth={ICO_STR} />
          </Ico>

          {/* Settings */}
          <Ico onClick={onOpenSettings} title="Settings">
            <Settings size={ICO_SZ} strokeWidth={ICO_STR} />
          </Ico>

          {/* Help */}
          <Ico title="Help">
            <HelpCircle size={ICO_SZ} strokeWidth={ICO_STR} />
          </Ico>

          {/* Profile */}
          <Ico title="Profile">
            <User size={ICO_SZ} strokeWidth={ICO_STR} />
          </Ico>
        </div>

      </div>
    </header>
  );
};
