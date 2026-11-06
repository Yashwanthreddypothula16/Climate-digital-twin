import React from 'react';
import {
  NAV_FONT, NAV_SIZE, NAV_WEIGHT, NAV_LS, NAV_LH, NAV_COLOR, NAV_HOVER,
  TAB_W, TAB_H, TAB_PAD, TAB_RADIUS, TAB_BG, TAB_BORDER, TAB_SHADOW,
  TAB_T_SIZE, TAB_T_WEIGHT, TAB_T_COLOR,
} from './headerConstants';

interface NavItemProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    style={{
      position:       'relative',
      width:          isActive ? TAB_W : 'auto',
      height:         TAB_H,
      padding:        isActive ? TAB_PAD : '0',
      borderRadius:   TAB_RADIUS,
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      flexShrink:     0,
      whiteSpace:     'nowrap',
      background:     isActive ? TAB_BG : 'transparent',
      border:         isActive ? TAB_BORDER : '1px solid transparent',
      boxShadow:      isActive ? TAB_SHADOW : 'none',
      fontFamily:     NAV_FONT,
      fontSize:       isActive ? TAB_T_SIZE   : NAV_SIZE,
      fontWeight:     isActive ? TAB_T_WEIGHT : NAV_WEIGHT,
      lineHeight:     NAV_LH,
      letterSpacing:  NAV_LS,
      textTransform:  'uppercase' as const,
      color:          isActive ? TAB_T_COLOR : NAV_COLOR,
      cursor:         'pointer',
      outline:        'none',
      userSelect:     'none',
      transition:     'all 0.15s ease',
    }}
    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = NAV_HOVER; }}
    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = NAV_COLOR; }}
  >
    {label}

    {/* Bottom cyan glow bar on active pill */}
    {isActive && (
      <span style={{
        position: 'absolute', bottom: -1, left: '15%', right: '15%',
        height: 1, borderRadius: 1,
        background: '#00F0FF',
        boxShadow: '0 0 2px rgba(0,240,255,0.4)',
      }} />
    )}
  </button>
);