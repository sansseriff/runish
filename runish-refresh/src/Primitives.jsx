// Shared primitives for the Runish UI kit.
// Tokens live in ../../colors_and_type.css. No legacy token names; keep to
// the semantic set (--bg, --fg, --fg-strong, --border, --rule, --accent-*).

// Hair-thin diamond. Used ONLY on section-header bottom corners and the
// active-nav marker. Never as a generic rectangle ornament.
function Diamond({ position = 'bl', size = 6, subtle = false }) {
  const base = {
    position: 'absolute',
    width: size, height: size,
    transform: 'rotate(45deg)',
    background: 'var(--bg)',
    border: '1px solid ' + (subtle ? 'var(--border)' : 'var(--border-strong)'),
    borderRadius: 1,
    zIndex: 20,
  };
  const off = -(size / 2 + 0.5);
  const pos = {
    tl: { top: off, left: off },
    tr: { top: off, right: off },
    bl: { bottom: off, left: off },
    br: { bottom: off, right: off },
  }[position];
  return <span aria-hidden style={{ ...base, ...pos }} />;
}

// A subtle 14px dotted grid, masked to fade upward. Marks section headers.
function GridDots({ opacity = 0.14 }) {
  return (
    <svg aria-hidden style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      fill: 'var(--accent-500)', stroke: 'var(--accent-500)',
      maskImage: 'linear-gradient(to top, #000 0%, transparent 80%)',
      WebkitMaskImage: 'linear-gradient(to top, #000 0%, transparent 80%)',
      opacity, zIndex: 0, pointerEvents: 'none',
    }}>
      <defs>
        <pattern id="runish-grid" width="14" height="14" patternUnits="userSpaceOnUse" x="-1" y="-1">
          <path d="M.5 14V.5H14" fill="none" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#runish-grid)" />
    </svg>
  );
}

// Section header. Fixed height, bottom border, two bottom-corner diamonds.
// This is the ONLY place diamonds appear by default.
function SectionHeader({ title, eyebrow, children, compact = false }) {
  return (
    <header style={{
      position: 'relative',
      minHeight: compact ? 96 : 140,
      padding: compact ? '24px 32px 20px' : '40px 32px 24px',
      borderBottom: '1px solid var(--rule)',
      overflow: 'visible',
    }}>
      <Diamond position="bl" />
      <Diamond position="br" />
      <GridDots />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {eyebrow && (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase',
            color: 'var(--fg-muted)', marginBottom: 10,
          }}>{eyebrow}</div>
        )}
        {title && (
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontWeight: 500,
            fontSize: 22, letterSpacing: '-0.01em',
            lineHeight: 1.2, color: 'var(--fg-strong)', margin: 0,
          }}>{title}</h2>
        )}
        {children}
      </div>
    </header>
  );
}

// Per-letter Moonrune flourish. Falls back gracefully when the font is absent.
function useFlourish(letters, enabled = true) {
  const [runic, setRunic] = React.useState(() => letters.map(() => false));
  React.useEffect(() => {
    if (!enabled) return;
    const timers = [];
    letters.forEach((_, i) => {
      const start = Math.random() * 1200;
      const duration = 400 + Math.random() * 1600;
      const t1 = setTimeout(() => {
        setRunic(r => { const n = [...r]; n[i] = true; return n; });
        const t2 = setTimeout(() => {
          setRunic(r => { const n = [...r]; n[i] = false; return n; });
        }, duration);
        timers.push(t2);
      }, start);
      timers.push(t1);
    });
    return () => timers.forEach(clearTimeout);
  }, []);
  return runic;
}

function RunishText() {
  const letters = ['R', 'u', 'n', 'i', '.', 's', 'h'];
  const runic = useFlourish(letters);
  const [hover, setHover] = React.useState(letters.map(() => false));
  const setH = (i, v) => setHover(h => { const n = [...h]; n[i] = v; return n; });
  return (
    <span style={{ display: 'inline-block', lineHeight: 1 }}>
      {letters.map((l, i) => {
        const isRunic = runic[i] || hover[i];
        const isDot = l === '.';
        return (
          <span key={i}
            onMouseEnter={() => setH(i, true)}
            onMouseLeave={() => setH(i, false)}
            style={{
              display: 'inline-block',
              fontFamily: isRunic ? 'var(--font-rune)' : 'inherit',
              fontStyle: isRunic ? 'italic' : 'normal',
              color: isDot ? 'var(--accent-500)' : 'inherit',
              transition: 'color .18s ease',
            }}>{l}</span>
        );
      })}
    </span>
  );
}

// Wordmark. Serif "Something", tighter tracking, Runish in inky color.
function Wordmark({ size = 'lg' }) {
  const fontSize = size === 'lg' ? 32 : size === 'md' ? 22 : 16;
  return (
    <span style={{
      fontFamily: 'var(--font-serif)', fontWeight: 500,
      fontSize, lineHeight: 1, letterSpacing: '-0.015em',
      display: 'inline-flex', alignItems: 'baseline', gap: '0.25em',
      color: 'var(--fg-strong)',
    }}>
      <span>Something</span>
      <span><RunishText /></span>
    </span>
  );
}

// Filter chip — lowercased label, leading diamond glyph, 2px radius.
function FilterPill({ active, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '4px 10px',
      fontSize: 12, fontFamily: 'var(--font-sans)', fontWeight: 500,
      borderRadius: 2,
      border: '1px solid ' + (active ? 'var(--ink-200)' : 'var(--border)'),
      background: active ? 'var(--ink-200)' : 'transparent',
      color: active ? 'var(--fg-inverse)' : 'var(--fg)',
      cursor: 'pointer',
      transition: 'background .18s, color .18s, border-color .18s',
      letterSpacing: 0,
    }}>
      <span style={{ marginRight: 6, opacity: 0.8 }}>◇</span>{label}
    </button>
  );
}

// Text link — animated-underline style matching a.css base.
function Link({ href = '#', children, onClick, style }) {
  return (
    <a href={href} onClick={onClick} style={{
      color: 'inherit',
      backgroundImage: 'linear-gradient(to right, var(--fg-accent), var(--fg-accent))',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '0 1px',
      backgroundPosition: '0 100%',
      transition: 'color .18s ease, background-size .25s ease',
      ...style,
    }}
    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--fg-accent)'; e.currentTarget.style.backgroundSize = '100% 1px'; }}
    onMouseLeave={(e) => { e.currentTarget.style.color = 'inherit'; e.currentTarget.style.backgroundSize = '0 1px'; }}
    >{children}</a>
  );
}

// Nav item — right-aligned, active state marked by a tiny left-side diamond.
function NavItem({ label, active, onClick }) {
  return (
    <li style={{ listStyle: 'none', textAlign: 'right', margin: '10px 0', position: 'relative' }}>
      <a href="#" onClick={(e) => { e.preventDefault(); onClick?.(); }}
         onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = 'var(--fg-strong)'; }}
         onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'var(--fg-muted)'; }}
         style={{
           color: active ? 'var(--fg-strong)' : 'var(--fg-muted)',
           textDecoration: 'none',
           fontFamily: 'var(--font-mono)', fontSize: 11,
           fontWeight: active ? 600 : 400,
           letterSpacing: '.10em', textTransform: 'uppercase',
           paddingRight: 18,
           transition: 'color .18s ease',
           display: 'inline-block', position: 'relative',
         }}>
        {label}
        {active && (
          <span aria-hidden style={{
            position: 'absolute',
            right: 'calc(100% + 8px)', top: '50%',
            width: 6, height: 6,
            transform: 'translateY(-50%) rotate(45deg)',
            background: 'var(--fg-accent)',
            borderRadius: 1,
          }} />
        )}
      </a>
    </li>
  );
}

// Keyboard-hint chip. Signature Zed-style microcomponent.
function Kbd({ children }) {
  return (
    <kbd style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 20, height: 20, padding: '0 6px',
      fontFamily: 'var(--font-mono)', fontSize: 11,
      color: 'var(--fg-muted)',
      background: 'var(--bg)',
      border: '1px solid var(--border)',
      borderBottomWidth: 2,
      borderRadius: 3,
      lineHeight: 1,
    }}>{children}</kbd>
  );
}

Object.assign(window, {
  Diamond, GridDots, SectionHeader,
  RunishText, Wordmark, FilterPill, Link, NavItem, Kbd, useFlourish,
});
