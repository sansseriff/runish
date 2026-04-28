// Three-column shell: left nav sidebar · main column · right theme sidebar.
// No diagonal-hatch background on the shell — the old motif read as visual
// noise and has been removed from everywhere except the section headers
// (which replace hatch with a masked dotted grid).

function Icon({ name, size = 20 }) {
  // Line icons at stroke 1.6, round joins. Matches Phosphor "regular".
  const common = {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.6,
    strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (name) {
    case 'sun': return (<svg {...common}>
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>);
    case 'moon': return (<svg {...common}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>
    </svg>);
    case 'github': return (<svg {...common}>
      <path d="M9 19c-4 1.5-4-2-6-2m12 4v-3.5a3 3 0 0 0-.9-2.3c3-.3 6-1.5 6-6.5a5 5 0 0 0-1.4-3.5 4.7 4.7 0 0 0-.1-3.4s-1.1-.3-3.6 1.3a12 12 0 0 0-6 0C7 2 5.9 2.3 5.9 2.3a4.7 4.7 0 0 0-.1 3.4A5 5 0 0 0 4.4 9.2c0 5 3 6.2 6 6.5a3 3 0 0 0-.9 2.3V21"/>
    </svg>);
    case 'instagram': return (<svg {...common}>
      <rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor"/>
    </svg>);
    case 'cap': return (<svg {...common}>
      <path d="M2 10l10-5 10 5-10 5-10-5z"/><path d="M6 12v4c2 2 10 2 12 0v-4"/><path d="M22 10v6"/>
    </svg>);
    case 'bluesky': return (<svg {...common} viewBox="0 0 256 256" strokeWidth={14}>
      <path d="M70.22 52.98c23.39 17.4 48.55 52.68 57.78 71.62 9.24-18.93 34.4-54.21 57.79-71.62 16.87-12.56 44.21-22.27 44.21 8.64 0 6.17-3.57 51.86-5.67 59.28-7.28 25.79-33.82 32.36-57.42 28.38 41.26 6.96 51.75 30.01 29.09 53.06-43.05 43.78-61.87-10.98-66.7-25.01-.88-2.57-1.13-2.75-1.3-2.75-.18 0-.42.18-1.3 2.75-4.83 14.03-23.65 68.79-66.7 25.01-22.67-23.05-12.17-46.1 29.09-53.06-23.6 3.98-50.14-2.59-57.42-28.38-2.1-7.42-5.66-53.11-5.66-59.28 0-30.91 27.34-21.2 44.21-8.64z"/>
    </svg>);
    default: return null;
  }
}

function BrandLockup({ onClick }) {
  // Small persistent brand mark at top of left nav.
  // padding-right matches NavItem's effective right inset (ul 18 + anchor 18 = 36)
  // so the wordmark's right edge aligns with the nav labels' right edge.
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick?.(); }}
       style={{
         display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
         gap: 8, textDecoration: 'none', color: 'var(--fg-strong)',
         padding: '0 36px 0 0', marginBottom: 28,
       }}>
      <img src="assets/Runish.svg" width="18" height="18" alt="" />
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 500,
        letterSpacing: '.04em', textTransform: 'lowercase',
        color: 'var(--fg-strong)',
      }}>runi.sh</span>
    </a>
  );
}

function LeftSidebar({ current, onNav }) {
  return (
    <aside style={{
      width: 168, flex: '0 0 168px',
      borderRight: '1px solid var(--rule)',
      position: 'sticky', top: 0, alignSelf: 'stretch',
      padding: '48px 0 24px', display: 'flex', flexDirection: 'column',
      minHeight: '100vh',
    }}>
      <BrandLockup onClick={() => onNav('home')} />
      <ul style={{ padding: '4px 18px 20px 0', margin: 0, listStyle: 'none' }}>
        <NavItem label="Home" active={current === 'home'} onClick={() => onNav('home')} />
        <NavItem label="About" active={current === 'about'} onClick={() => onNav('about')} />
        <NavItem label="Portfolio" active={current === 'portfolio'} onClick={() => onNav('portfolio')} />
        <NavItem label="Blog" active={current === 'blog'} onClick={() => onNav('blog')} />
      </ul>
      {/* socials moved to page footer */}
    </aside>
  );
}

function RightSidebar({ isDark, onToggleTheme }) {
  return (
    <aside style={{
      width: 168, flex: '0 0 168px',
      borderLeft: '1px solid var(--rule)',
      position: 'sticky', top: 0, alignSelf: 'stretch',
      padding: '48px 18px 24px 12px',
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
      color: 'var(--fg-muted)',
    }}>
      {/* theme toggle moved to hero top-right */}
      <div style={{ marginTop: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10,
        color: 'var(--fg-subtle)', letterSpacing: '.06em' }}>
        © {new Date().getFullYear()} · AM
      </div>
    </aside>
  );
}

function Layout({ current, onNav, isDark, onToggleTheme, children, wide }) {
  const maxWidth = wide ? 'min(1200px, 95vw)' : 'min(896px, 95vw)';
  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>
      <div style={{
        maxWidth, margin: '0 auto',
        transition: 'max-width 600ms ease-in-out',
      }}>
        <div style={{ display: 'flex' }}>
          <LeftSidebar current={current} onNav={onNav} />
          <section style={{
            flex: '1 1 auto',
            borderLeft: '1px solid var(--rule)',
            borderRight: '1px solid var(--rule)',
            position: 'relative', minHeight: '100vh',
          }}>
            {children}
          </section>
          <RightSidebar isDark={isDark} onToggleTheme={onToggleTheme} />
        </div>
      </div>
    </main>
  );
}

Object.assign(window, { Icon, LeftSidebar, RightSidebar, Layout, BrandLockup });
