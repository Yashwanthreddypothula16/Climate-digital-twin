// ─────────────────────────────────────────────────────────────────────────────
// Header Design Tokens — STRICT PIXEL MATCH
// ─────────────────────────────────────────────────────────────────────────────

// ══ LAYOUT ══════════════════════════════════════════════════════════════════
export const H_HEIGHT     = 58;      // px
export const H_PAD_X      = 16;      // px

// ══ BACKGROUND ══════════════════════════════════════════════════════════════
export const H_BG         = '#020810';
export const H_BORDER     = '1px solid rgba(0, 240, 255, 0.08)';
export const H_SHADOW     = 'none';
export const H_BLUR       = 'none';

// ══ EMBLEM ══════════════════════════════════════════════════════════════════
export const LOGO_D       = 34;      // px
export const LOGO_GAP     = 12;      // px
export const LOGO_BORDER  = 'rgba(255, 255, 255, 0.06)';
export const LOGO_SHADOW  = 'none';

// ══ BRAND TITLE ═════════════════════════════════════════════════════════════
export const T_FAMILY     = "'Inter','Segoe UI',sans-serif";
export const T_SIZE       = 16.5;    // px
export const T_WEIGHT     = 600;
export const T_LH         = 18;      // px
export const T_LS         = '0px'; 
export const T_COLOR      = '#F8FAFC';

// ══ SUBTITLE ════════════════════════════════════════════════════════════════
export const S_SIZE       = 10;      // px
export const S_WEIGHT     = 500;
export const S_LH         = 12;      // px
export const S_LS         = '0px';
export const S_COLOR      = '#00D1FF'; // cyan

// ══ NAVIGATION ══════════════════════════════════════════════════════════════
export const NAV_FONT     = "'Inter','Segoe UI',sans-serif";
export const NAV_SIZE     = 11;      // px
export const NAV_WEIGHT   = 500;
export const NAV_LS       = '0px';
export const NAV_LH       = '12px';
export const NAV_COLOR    = '#7E8FA0';
export const NAV_HOVER    = '#FFFFFF';
export const NAV_GAP      = 14;      // px - compressed horizontal spacing

// ══ ACTIVE TAB PILL ═════════════════════════════════════════════════════════
export const TAB_W        = 106;     // px
export const TAB_H        = 32;      // px
export const TAB_PAD      = '0';     // padding handled by fixed width for active tab
export const TAB_RADIUS   = 6;       // px
export const TAB_BG       = 'rgba(0, 240, 255, 0.06)';
export const TAB_BORDER   = '1px solid rgba(0, 240, 255, 0.2)';
export const TAB_SHADOW   = 'none';
export const TAB_T_SIZE   = 11;      // px
export const TAB_T_WEIGHT = 600;
export const TAB_T_COLOR  = '#00F0FF';

// ══ ICONS ════════════════════════════════════════════════════════════════════
export const ICO_SZ       = 17;      // px
export const ICO_STR      = 1.5;
export const ICO_COL      = '#7E8FA0';
export const ICO_HOV      = '#FFFFFF';
export const ICO_GAP      = 12;      // px - compressed spacing between icons

// ══ CLOCK ════════════════════════════════════════════════════════════════════
export const CLK_T_SZ     = 13.5;    // px
export const CLK_T_W      = 600;
export const CLK_T_COL    = '#F8FAFC';
export const CLK_D_SZ     = 8.5;     // px
export const CLK_D_W      = 400;
export const CLK_D_COL    = '#7E8FA0';

// ══ DIVIDER ══════════════════════════════════════════════════════════════════
export const DIV_COL      = 'rgba(255,255,255,0.08)';

// ══ NAV ITEMS ════════════════════════════════════════════════════════════════
export type NavTab =
  'DASHBOARD' | 'HISTORICAL' | 'PREDICTIONS' | 'SIMULATION' |
  'ANALYTICS' | 'REPORTS' | 'ALERTS' | 'MODEL_PERFORMANCE';

export const NAV_ITEMS: NavTab[] = [
  'DASHBOARD','HISTORICAL','PREDICTIONS','SIMULATION',
  'ANALYTICS','REPORTS','ALERTS', 'MODEL_PERFORMANCE'
];