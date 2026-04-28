// HomeRemix — shader as a background wash spanning the full hero,
// wordmark + intro sit on top. Two aligned preview columns below.

const BLOG_POSTS = [
  { date: 'Apr 12, 2026',  tag: 'Essay',
    title: 'Things that aren\u2019t graphs',
    summary: 'On the scientific notebook as a medium \u2014 and why most dashboards fail it.' },
  { date: 'Mar 30, 2026',  tag: 'Note',
    title: 'A quieter photon counter',
    summary: 'Tuning the bias point where dark counts drop but efficiency stays.' },
  { date: 'Mar 04, 2026',  tag: 'Essay',
    title: 'The problem with three minute thesis',
    summary: 'Why the popular 3MT competition fails to capture what makes science communication effective.' },
  { date: 'Feb 18, 2026',  tag: 'Note',
    title: 'Interference, explained slowly',
    summary: 'Building an interactive diagram until the math felt like a description, not a rule.' },
];

// Project image "fragments" — small slivers cropped from each project's hero.
// Images are procedurally generated in CSS (radial-gradient compositions that
// match the color-graded portfolio hero treatment from the real site) so the
// page works offline without importing assets. A real Runish deploy would
// swap in actual WEBP frames.
const PROJECTS = [
  { tag: 'quantum',  year: '2026',
    title: 'Lattice',
    summary: 'A live plot of detector counts on a superconducting nanowire array, streamed to the browser.',
    frag: 'radial-gradient(ellipse at 30% 65%, #24506B 0%, #0B1826 55%), linear-gradient(180deg, #13344A 0%, #06101C 100%)' },
  { tag: 'software', year: '2025',
    title: 'Agent metrics',
    summary: 'Observability tooling for long-running scientific agents. Small, local, opinionated.',
    frag: 'radial-gradient(circle at 70% 40%, #7A4A1E 0%, #2A1808 60%), linear-gradient(180deg, #3E2510 0%, #120A03 100%)' },
  { tag: 'visual',   year: '2025',
    title: 'Wormhole',
    summary: 'Cover image for Nature 612 and accompanying press\u2011release visualizations.',
    frag: 'radial-gradient(ellipse at 65% 45%, #3B5785 0%, #1A2840 55%, #0B1426 100%), radial-gradient(circle at 65% 45%, rgba(255,205,140,.28) 0%, transparent 45%)' },
  { tag: 'quantum',  year: '2024',
    title: 'Entanglement budget',
    summary: 'A notebook for thinking about resource costs in quantum repeater chains.',
    frag: 'radial-gradient(ellipse at 50% 50%, #5A3160 0%, #1A0C20 65%), linear-gradient(180deg, #2E1834 0%, #0A050E 100%)' },
];

// ========================================================================
// HERO — shader wash background, content on top
// ========================================================================
function HeroBand({ isDark, preset, density, speed, accent, onPulse, onToggleTheme }) {
  return (
    <section style={{
      position: 'relative',
      borderBottom: '1px solid var(--rule)',
      overflow: 'hidden',
      minHeight: 520,
    }}>
      {/* Shader fills the entire hero band as a background wash */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        opacity: 1,
      }}>
        <ShaderCanvas
          preset={preset}
          isDark={isDark}
          density={density}
          speed={speed}
          accent={accent}
          onPulse={onPulse}
        />
      </div>

      {/* A very faint paper overlay to guarantee text legibility */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: isDark
          ? 'linear-gradient(180deg, rgba(14,14,16,0.10) 0%, rgba(14,14,16,0.25) 100%)'
          : 'linear-gradient(180deg, rgba(251,249,244,0.18) 0%, rgba(251,249,244,0.32) 100%)',
      }} />

      {/* Bottom-edge fade to page background — so the shader blends into
          the preview columns below instead of cutting off at a hard edge. */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%',
        zIndex: 1, pointerEvents: 'none',
        background: isDark
          ? 'linear-gradient(180deg, rgba(14,14,16,0) 0%, rgba(14,14,16,0.55) 55%, rgba(14,14,16,1) 100%)'
          : 'linear-gradient(180deg, rgba(251,249,244,0) 0%, rgba(251,249,244,0.55) 55%, rgba(251,249,244,1) 100%)',
      }} />

      {/* Corner registration marks on the hero */}
      <CornerMark pos="tl" />
      <CornerMark pos="tr" />
      <CornerMark pos="bl" />
      <CornerMark pos="br" />

      {/* Content — aligned with the 28px column padding used in the preview columns below */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: '56px 28px 36px',
        display: 'flex', flexDirection: 'column', gap: 28,
        pointerEvents: 'none',
      }}>
        <div style={{ pointerEvents: 'none' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            letterSpacing: '.10em', textTransform: 'uppercase',
            color: 'var(--fg-muted)', marginBottom: 22,
            display: 'flex', gap: 10, alignItems: 'center',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: 1, transform: 'rotate(45deg)',
              background: 'var(--fg-accent)', display: 'inline-block',
            }} />
            <span>live</span>
            <span style={{ marginLeft: 'auto', pointerEvents: 'auto' }}>
              <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
            </span>
          </div>

          <div style={{
            fontFamily: 'var(--font-serif)', fontWeight: 400,
            fontSize: 24, color: 'var(--fg-muted)',
            letterSpacing: '-0.01em', marginBottom: 4,
          }}>Something</div>

          <h1 style={{
            fontFamily: 'var(--font-serif)', fontWeight: 500,
            fontSize: 64, letterSpacing: '-0.02em',
            lineHeight: 1.0, margin: 0,
            color: 'var(--fg-strong)',
            pointerEvents: 'auto',
            display: 'inline-block',
          }}>
            <RunishText />
          </h1>

          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: 16,
            lineHeight: 1.6, color: 'var(--fg-muted)',
            margin: '26px 0 0', maxWidth: '52ch',
          }}>
            Portfolio and blog of Andrew Mueller — mildly mystical, mostly scientific.
            Superconducting single‑photon detectors, quantum networks, and the
            occasional attempt to tell a story about either.
          </p>
        </div>

        {/* Transmission log / footer strip — anchored at the bottom of the hero */}
        <div style={{
          marginTop: 'auto', paddingTop: 20,
          borderTop: '1px solid var(--rule)',
          display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--fg-muted)', letterSpacing: '.04em',
          pointerEvents: 'none',
        }}>
          <span>v0.5</span>
          <span style={{ color: 'var(--fg-subtle)' }}>·</span>
          <span>latest: <Link>Agent metrics</Link></span>
          <span style={{ color: 'var(--fg-subtle)' }}>·</span>
          <span>click anywhere in the field to emit a pulse</span>
          <span style={{ marginLeft: 'auto', color: 'var(--fg-subtle)' }}>
            {PRESET_LABEL[preset] || preset} · ch 1
          </span>
        </div>
      </div>
    </section>
  );
}

const PRESET_LABEL = {
  ascii:  'ascii · text field',
  plasma: 'plasma · muted',
  ember:  'ember · warm/cool',
  weave:  'weave · three-axis',
  jormun: 'jörmungandr · serpent',
  rune:   'runestone · ring-chain',
  valk:   'valknut · triquetra',
};

function CornerMark({ pos }) {
  const S = 14;
  const styles = {
    tl: { top: 10,  left: 10,  borderTop: '1px solid var(--fg-muted)', borderLeft: '1px solid var(--fg-muted)' },
    tr: { top: 10,  right: 10, borderTop: '1px solid var(--fg-muted)', borderRight: '1px solid var(--fg-muted)' },
    bl: { bottom: 10, left: 10, borderBottom: '1px solid var(--fg-muted)', borderLeft: '1px solid var(--fg-muted)' },
    br: { bottom: 10, right: 10, borderBottom: '1px solid var(--fg-muted)', borderRight: '1px solid var(--fg-muted)' },
  }[pos];
  return <span aria-hidden style={{
    position: 'absolute', width: S, height: S, opacity: 0.3, zIndex: 3,
    pointerEvents: 'none',
    ...styles,
  }} />;
}

// ========================================================================
// EDITORIAL PREVIEW COLUMNS (aligned)
// ========================================================================

// Shared constants — both columns use the SAME padding so the rule lines
// align perfectly. Row grid columns differ only in the first track.
const COL_PAD_X = 28;
const HEADER_PAD = `24px ${COL_PAD_X}px 14px`;
const ROW_PAD   = `16px ${COL_PAD_X}px`;

function ColHeader({ eyebrow, title, meta }) {
  return (
    <header style={{
      padding: HEADER_PAD,
      borderBottom: '1px solid var(--rule)',
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      gap: 14, minHeight: 78, boxSizing: 'border-box',
    }}>
      <div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          letterSpacing: '.10em', textTransform: 'uppercase',
          color: 'var(--fg-subtle)', marginBottom: 4,
        }}>{eyebrow}</div>
        <h2 style={{
          fontFamily: 'var(--font-serif)', fontWeight: 500,
          fontSize: 18, letterSpacing: '-0.01em',
          color: 'var(--fg-strong)', margin: 0,
        }}>{title}</h2>
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10,
        letterSpacing: '.08em', textTransform: 'uppercase',
        color: 'var(--fg-subtle)',
      }}>{meta}</div>
    </header>
  );
}

function BlogRow({ post }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href="#" onClick={(e) => e.preventDefault()}
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
       style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
      <article style={{
        padding: ROW_PAD,
        background: hover ? 'var(--bg-hover)' : 'transparent',
        transition: 'background .18s ease',
        display: 'grid', gridTemplateColumns: '84px 1fr auto', gap: 18,
        alignItems: 'baseline', minHeight: 84, boxSizing: 'border-box',
      }}>
        <time style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--fg-subtle)', letterSpacing: '.04em',
        }}>{post.date}</time>
        <div>
          <h3 style={{
            fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 17,
            margin: '0 0 4px', color: hover ? 'var(--fg-accent)' : 'var(--fg-strong)',
            letterSpacing: '-0.01em', transition: 'color .18s ease',
          }}>{post.title}</h3>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.55,
            margin: 0, color: 'var(--fg-muted)', maxWidth: '50ch',
          }}>{post.summary}</p>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '.08em', textTransform: 'uppercase',
          color: 'var(--fg-subtle)', alignSelf: 'start', paddingTop: 4,
        }}>{post.tag}</span>
      </article>
    </a>
  );
}

// A small painterly sliver of the project image. Displayed as a tall
// 52×56 fragment with a subtle border + an accent strip on hover.
function ProjectFragment({ bg, hover }) {
  return (
    <div style={{
      position: 'relative',
      width: 52, height: 56, flex: '0 0 auto',
      borderRadius: 2,
      border: '1px solid var(--border)',
      background: bg,
      overflow: 'hidden',
      boxShadow: hover ? 'var(--shadow-1)' : 'none',
      transition: 'box-shadow .2s ease, border-color .2s ease',
      borderColor: hover ? 'var(--border-strong)' : 'var(--border)',
    }}>
      {/* Faint paper gradient on top for consistency with the DS */}
      <span style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)',
      }} />
      {/* A tiny accent tick that lights up on hover — a nod to the DS diamond */}
      <span style={{
        position: 'absolute', left: 5, top: 5,
        width: 4, height: 4, borderRadius: 0.5,
        transform: 'rotate(45deg)',
        background: hover ? 'var(--fg-accent)' : 'rgba(255,255,255,0.6)',
        transition: 'background .2s ease',
      }} />
    </div>
  );
}

function ProjectRow({ p }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href="#" onClick={(e) => e.preventDefault()}
       onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
       style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
      <article style={{
        padding: ROW_PAD,
        background: hover ? 'var(--bg-hover)' : 'transparent',
        transition: 'background .18s ease',
        display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: 18,
        alignItems: 'center', minHeight: 84, boxSizing: 'border-box',
      }}>
        <ProjectFragment bg={p.frag} hover={hover} />
        <div style={{ alignSelf: 'center' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6,
          }}>
            <img src={`assets/icons/${p.tag}_icon.svg`} alt={p.tag} style={{
              width: 11, height: 11, opacity: .85,
            }} />
            <h3 style={{
              fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12,
              letterSpacing: '.10em', textTransform: 'uppercase',
              margin: 0,
              color: hover ? 'var(--fg-accent)' : 'var(--fg-strong)',
              transition: 'color .18s ease',
            }}>{p.title}</h3>
          </div>
          <p style={{
            fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.55,
            margin: 0, color: 'var(--fg-muted)', maxWidth: '50ch',
          }}>{p.summary}</p>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '.08em', textTransform: 'uppercase',
          color: 'var(--fg-subtle)', alignSelf: 'start', paddingTop: 4,
        }}>{p.year}</span>
      </article>
    </a>
  );
}

function PreviewsGrid() {
  return (
    <section style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      borderBottom: '1px solid var(--rule)',
    }}>
      <div style={{
        borderRight: '1px solid var(--rule)',
        display: 'flex', flexDirection: 'column',
      }}>
        <ColHeader eyebrow="Notes" title="From the desk." meta="Blog · 4 of 12" />
        {BLOG_POSTS.map((p, i) => (
          <React.Fragment key={i}>
            <BlogRow post={p} />
            {i < BLOG_POSTS.length - 1 && <div style={{ margin: `0 ${COL_PAD_X}px`, borderBottom: '1px solid var(--rule)' }} />}
          </React.Fragment>
        ))}
        <div style={{
          marginTop: 'auto',
          padding: `14px ${COL_PAD_X}px 20px`,
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--fg-muted)', letterSpacing: '.06em',
          borderTop: '1px solid var(--rule)',
        }}>
          <Link>All notes →</Link>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <ColHeader eyebrow="Projects" title="Built with code, built with colors." meta="Portfolio · 4 of 9" />
        {PROJECTS.map((p, i) => (
          <React.Fragment key={i}>
            <ProjectRow p={p} />
            {i < PROJECTS.length - 1 && <div style={{ margin: `0 ${COL_PAD_X}px`, borderBottom: '1px solid var(--rule)' }} />}
          </React.Fragment>
        ))}
        <div style={{
          marginTop: 'auto',
          padding: `14px ${COL_PAD_X}px 20px`,
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--fg-muted)', letterSpacing: '.06em',
          borderTop: '1px solid var(--rule)',
        }}>
          <Link>All projects →</Link>
        </div>
      </div>
    </section>
  );
}

function ThemeToggle({ isDark, onToggle }) {
  return (
    <button onClick={onToggle} aria-label="Toggle theme" style={{
      background: 'transparent', border: '1px solid var(--border)',
      borderRadius: 2, padding: '4px 8px', cursor: 'pointer',
      color: 'var(--fg-muted)',
      fontFamily: 'var(--font-mono)', fontSize: 10,
      letterSpacing: '.08em', textTransform: 'uppercase',
      display: 'inline-flex', alignItems: 'center', gap: 6,
      transition: 'color .18s, border-color .18s',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--fg-strong)'; e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
      <span aria-hidden style={{
        width: 7, height: 7, borderRadius: '50%',
        background: isDark ? 'var(--fg-muted)' : 'transparent',
        border: '1px solid var(--fg-muted)',
      }} />
      {isDark ? 'dark' : 'light'}
    </button>
  );
}

function SocialGlyph({ name }) {
  // Tiny mono-style glyphs, bracket-framed so they read as terminal chips.
  const labels = { gh: 'gh', bsky: 'bsky', ig: 'ig', edu: 'edu' };
  return (
    <span style={{ opacity: 0.9 }}>[{labels[name]}]</span>
  );
}

function SocialFooter() {
  const items = [
    { k: 'gh',   label: 'GitHub' },
    { k: 'bsky', label: 'Bluesky' },
    { k: 'ig',   label: 'Instagram' },
    { k: 'edu',  label: 'Scholar' },
  ];
  return (
    <div style={{
      display: 'flex', gap: 16, alignItems: 'center',
      fontFamily: 'var(--font-mono)', fontSize: 11,
      color: 'var(--fg-muted)', letterSpacing: '.04em',
    }}>
      {items.map((it, i) => (
        <a key={it.k} href="#" onClick={(e)=>e.preventDefault()}
           title={it.label}
           style={{
             color: 'inherit', textDecoration: 'none',
             transition: 'color .18s',
           }}
           onMouseEnter={(e)=>e.currentTarget.style.color='var(--fg-accent)'}
           onMouseLeave={(e)=>e.currentTarget.style.color='var(--fg-muted)'}>
          <SocialGlyph name={it.k} />
        </a>
      ))}
    </div>
  );
}

function HomeRemix({ isDark, preset, density, speed, accent, onToggleTheme }) {
  const [pulseFlash, setPulseFlash] = React.useState(0);
  return (
    <article data-screen-label="01 Home">
      <HeroBand
        isDark={isDark} preset={preset} density={density}
        speed={speed} accent={accent}
        onPulse={() => setPulseFlash(n => n + 1)}
        onToggleTheme={onToggleTheme}
      />
      <PreviewsGrid />
      <footer style={{
        padding: `18px ${COL_PAD_X}px`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, flexWrap: 'wrap',
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: 'var(--fg-subtle)', letterSpacing: '.06em',
      }}>
        <span>© {new Date().getFullYear()} · runi.sh · AM</span>
        <SocialFooter />
        <span>press <Kbd>P</Kbd> to play · <Kbd>⇧</Kbd><Kbd>T</Kbd> for tweaks</span>
      </footer>
    </article>
  );
}

Object.assign(window, { HomeRemix });
