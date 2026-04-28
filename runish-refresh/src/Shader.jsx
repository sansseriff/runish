// ShaderCanvas — low-key background wash with 4 presets.
// All presets stay in Runish's muted palette: paper/ink + blue accent,
// with small excursions into muted purple and muted rust (never saturated,
// never gradient-heavy). Opacities are kept low so the shader reads as
// background texture behind the hero block.

const VERT = `#version 300 es
in vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const PRELUDE = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_dark;
uniform float u_density;
uniform float u_speed;
uniform float u_accent;
uniform vec4 u_pulses[8];
uniform int u_pulseCount;

vec3 PAPER_50  = vec3(0.984, 0.976, 0.957);
vec3 INK_200   = vec3(0.169, 0.169, 0.180);
vec3 INK_500   = vec3(0.055, 0.055, 0.063);
vec3 ACCENT_500 = vec3(0.231, 0.357, 0.859);
vec3 ACCENT_300 = vec3(0.557, 0.631, 0.910);
// Muted additions — never saturated
vec3 PURPLE = vec3(0.604, 0.384, 0.612);   // ~flag-visual, softened
vec3 RUST   = vec3(0.624, 0.302, 0.302);   // ~flag-quantum, softened
vec3 MOSS   = vec3(0.588, 0.365, 0.153);   // ~flag-software

vec3 bgCol(){ return mix(PAPER_50, INK_500, u_dark); }
vec3 fgCol(){ return mix(INK_200, vec3(.929,.929,.941), u_dark); }
vec3 mutedCol(){ return mix(vec3(.431,.431,.439), vec3(.604,.604,.631), u_dark); }
vec3 accentCol(){ return mix(ACCENT_500, ACCENT_300, u_dark); }

float hash21(vec2 p){ p = fract(p*vec2(234.34,435.345)); p += dot(p, p+34.23); return fract(p.x*p.y); }
float vnoise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash21(i), b = hash21(i+vec2(1,0)), c = hash21(i+vec2(0,1)), d = hash21(i+vec2(1,1));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i=0;i<5;i++){ v += a*vnoise(p); p *= 2.02; a *= 0.5; }
  return v;
}
`;

// -------- ASCII ----------------------------------------------------------
// Text-as-texture. Each cell picks a glyph from a procedural ramp based on
// a scalar field. Kept deliberately quiet (low alpha, single color).
const FRAG_ASCII = PRELUDE + `
// Draw a glyph bitmap for index 0..15 into a 5x7 cell at local uv (0..1).
// Very small hand-picked set — dots, dashes, diagonals, digits-ish shapes.
float glyph(int idx, vec2 uv){
  // 5 columns x 7 rows cell. Return 1 if pixel is "on".
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return 0.0;
  int x = int(floor(uv.x*5.0));
  int y = int(floor((1.0-uv.y)*7.0));
  // Encode via simple bitfields per row. Use small if-chains (GLSL ES 3.0).
  // Glyph bitmasks — bit 0 = col 0 ... bit 4 = col 4.
  int rows[7]; rows[0]=0;rows[1]=0;rows[2]=0;rows[3]=0;rows[4]=0;rows[5]=0;rows[6]=0;
  if (idx == 0){ /* blank */ }
  else if (idx == 1){ rows[6] = 4; }                                  // .
  else if (idx == 2){ rows[3] = 14; }                                 // -
  else if (idx == 3){ rows[2] = 4; rows[3] = 14; rows[4] = 4; }       // +
  else if (idx == 4){ rows[1]=1; rows[2]=2; rows[3]=4; rows[4]=8; rows[5]=16; } // /
  else if (idx == 5){ rows[1]=16; rows[2]=8; rows[3]=4; rows[4]=2; rows[5]=1; } // \\
  else if (idx == 6){ rows[1]=4; rows[2]=14; rows[3]=31; rows[4]=14; rows[5]=4; } // diamond
  else if (idx == 7){ rows[2]=10; rows[3]=10; rows[4]=10; }           // ::
  else if (idx == 8){ rows[1]=14; rows[2]=17; rows[3]=21; rows[4]=17; rows[5]=14; } // O
  else if (idx == 9){ rows[0]=31; rows[1]=17; rows[2]=17; rows[3]=17; rows[4]=17; rows[5]=17; rows[6]=31; } // []
  else if (idx == 10){ rows[0]=4; rows[1]=4; rows[2]=4; rows[3]=31; rows[4]=4; rows[5]=4; rows[6]=4; } // +
  else if (idx == 11){ rows[2]=21; rows[3]=10; rows[4]=21; } // weave
  else if (idx == 12){ rows[0]=1; rows[1]=2; rows[2]=4; rows[3]=8; rows[4]=16; rows[5]=8; rows[6]=4; } // > chevron
  else if (idx == 13){ rows[1]=17; rows[2]=10; rows[3]=4; rows[4]=10; rows[5]=17; } // X
  else if (idx == 14){ rows[0]=31; rows[3]=31; rows[6]=31; } // =
  else if (idx == 15){ rows[0]=21; rows[1]=10; rows[2]=21; rows[3]=10; rows[4]=21; rows[5]=10; rows[6]=21; } // dense
  int mask = rows[clamp(y,0,6)];
  int bit = (mask >> x) & 1;
  return float(bit);
}

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5*u_res) / u_res.y;
  float t = u_time * u_speed;

  // Cell grid — character cells, slightly taller than wide (like a monospaced font)
  float cellW = 0.014 / u_density;
  float cellH = cellW * 1.7;
  vec2 cell = vec2(floor((uv.x + 2.0)/cellW), floor((uv.y + 2.0)/cellH));
  vec2 inCell = vec2(fract((uv.x + 2.0)/cellW), fract((uv.y + 2.0)/cellH));

  // Field: a blob near mouse, a slow drifting low-freq noise, and a
  // rotating banded pattern so it has composition.
  vec2 mn = (u_mouse - 0.5) * vec2(u_res.x/u_res.y, 1.0);
  float d = length(uv - mn);
  float blob = exp(-d*d*3.5);
  float base = fbm(uv*1.4 + vec2(t*0.03, -t*0.02));
  float band = 0.5 + 0.5*sin(uv.x*2.8 + uv.y*1.2 + t*0.25);
  float field = base*0.65 + band*0.2 + blob*0.6;

  // Add click-pulse rings into the field
  for (int i=0;i<8;i++){
    if (i >= u_pulseCount) break;
    vec4 p = u_pulses[i];
    vec2 pp = (p.xy - 0.5) * vec2(u_res.x/u_res.y, 1.0);
    float age = u_time - p.z;
    if (age < 0.0 || age > 3.0) continue;
    float r = age * 0.55;
    float rd = abs(length(uv - pp) - r);
    field += exp(-rd*rd*120.0) * (1.0 - age/3.0) * 0.9;
  }

  field = clamp(field, 0.0, 1.2);

  // Map field → glyph index with a little per-cell jitter
  float jitter = hash21(cell + floor(t*2.0)*0.01);
  int idx = int(floor(clamp(field*11.0 + jitter*1.5, 0.0, 15.9)));

  // Only draw glyphs in a rough "content" mask — so areas read as sparse / dense
  float mask = smoothstep(0.12, 0.55, field);
  float g = glyph(idx, inCell) * mask;

  // Color: one muted tone, slightly tinted by the field value.
  // In light mode we darken the glyphs against paper; in dark we lighten.
  vec3 bg = bgCol();
  vec3 glyphCol = mix(mutedCol(), accentCol(), clamp(field*0.6*u_accent, 0.0, 0.6));
  // Keep it low-key: cap alpha
  float alpha = g * 0.85;
  vec3 col = mix(bg, glyphCol, alpha);

  outColor = vec4(col, 1.0);
}
`;

// -------- PLASMA (muted purples + blues) ---------------------------------
const FRAG_PLASMA = PRELUDE + `
void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5*u_res) / u_res.y;
  float t = u_time * u_speed;
  vec2 mn = (u_mouse - 0.5) * vec2(u_res.x/u_res.y, 1.0);

  // Low-frequency flow field
  vec2 q = uv*1.2 + vec2(t*0.05, -t*0.04);
  float n1 = fbm(q);
  float n2 = fbm(q*1.3 + vec2(n1*1.5, -n1));
  float n  = fbm(q + vec2(n2, -n2)*1.1);

  // mouse attracts/warps the field
  float md = length(uv - mn);
  n += exp(-md*md*3.0) * 0.4;

  // Click pulses add ripples
  for (int i=0;i<8;i++){
    if (i >= u_pulseCount) break;
    vec4 p = u_pulses[i];
    vec2 pp = (p.xy-0.5)*vec2(u_res.x/u_res.y,1.0);
    float age = u_time - p.z;
    if (age<0.0||age>3.0) continue;
    float r = age*0.5;
    float rd = abs(length(uv-pp)-r);
    n += exp(-rd*rd*140.0)*(1.0-age/3.0)*0.5;
  }

  n = clamp(n, 0.0, 1.2);

  // Palette — muted blue → muted purple. Very narrow range.
  vec3 a = accentCol();
  vec3 pur = PURPLE;
  vec3 wash = mix(a, pur, smoothstep(0.35, 0.85, n));
  // Soft desaturate toward neutral
  wash = mix(mutedCol(), wash, 0.55);

  // Contour hairlines where n crosses steps — VERY faint
  float stepped = n*6.0;
  float contour = 1.0 - smoothstep(0.0, 0.03, abs(fract(stepped) - 0.5));
  vec3 col = bgCol();
  col = mix(col, wash, smoothstep(0.15, 0.9, n) * 0.45 * u_accent);
  col = mix(col, fgCol(), contour*0.18);

  // Quiet dot grid underneath for scientific texture
  float dotSpacing = 0.035 / u_density;
  vec2 gUV = uv / dotSpacing;
  vec2 gF = fract(gUV) - 0.5;
  float dotm = 1.0 - smoothstep(0.04, 0.08, length(gF));
  col = mix(col, mutedCol(), dotm*0.28);

  outColor = vec4(col, 1.0);
}
`;

// -------- EMBER (muted rusts + blues) -----------------------------------
// A banded heat-map style but kept LOW alpha — rust warms bleed into blue.
const FRAG_EMBER = PRELUDE + `
void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5*u_res) / u_res.y;
  float t = u_time * u_speed;
  vec2 mn = (u_mouse - 0.5) * vec2(u_res.x/u_res.y, 1.0);

  // Slow drifting bands
  float a1 = sin(uv.y*8.0 + t*0.3 + sin(uv.x*2.0 + t*0.2)*0.6);
  float a2 = sin(uv.y*16.0 + t*0.15 - uv.x*3.0);
  float bands = 0.5 + 0.5*(a1*0.7 + a2*0.3);

  // Field intensity — higher near mouse, lower at edges
  float md = length(uv - mn);
  float intensity = exp(-md*md*1.6) * 0.7 + 0.2;

  // Click pulses
  for (int i=0;i<8;i++){
    if (i >= u_pulseCount) break;
    vec4 p = u_pulses[i];
    vec2 pp = (p.xy-0.5)*vec2(u_res.x/u_res.y,1.0);
    float age = u_time - p.z;
    if (age<0.0||age>3.0) continue;
    float r = age*0.5;
    float rd = abs(length(uv-pp)-r);
    intensity += exp(-rd*rd*140.0)*(1.0-age/3.0)*0.6;
  }
  intensity = clamp(intensity, 0.0, 1.5);

  // Palette: blue for cool bands, rust for warm peaks. Desaturated.
  vec3 cool = accentCol();
  vec3 warm = RUST;
  vec3 wash = mix(cool, warm, smoothstep(0.3, 0.9, bands));
  wash = mix(mutedCol(), wash, 0.55);

  vec3 col = bgCol();
  col = mix(col, wash, intensity * bands * 0.50 * u_accent);

  // Thin horizontal rules every N bands — looks like a spectrogram axis
  float axisBand = smoothstep(0.002, 0.0, abs(fract(uv.y*8.0) - 0.5));
  col = mix(col, mutedCol(), axisBand * 0.12);

  // Quiet dot grid
  float dotSpacing = 0.035 / u_density;
  vec2 gUV = uv / dotSpacing;
  vec2 gF = fract(gUV) - 0.5;
  float dotm = 1.0 - smoothstep(0.04, 0.08, length(gF));
  col = mix(col, mutedCol(), dotm*0.25);

  outColor = vec4(col, 1.0);
}
`;

// -------- WEAVE (orthogonal lines, blue + purple + rust, very quiet) ----
const FRAG_WEAVE = PRELUDE + `
void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5*u_res) / u_res.y;
  float t = u_time * u_speed;
  vec2 mn = (u_mouse - 0.5) * vec2(u_res.x/u_res.y, 1.0);

  // Three overlapping orthogonal line families at slight angles.
  float ang1 = 0.0;
  float ang2 = 1.5707963;
  float ang3 = 0.785398;

  float spacing = 0.05 / u_density;

  float l1 = abs(sin((uv.x*cos(ang1) + uv.y*sin(ang1))/spacing*3.14159 + t*0.25));
  float l2 = abs(sin((uv.x*cos(ang2) + uv.y*sin(ang2))/spacing*3.14159 + t*0.18));
  float l3 = abs(sin((uv.x*cos(ang3) + uv.y*sin(ang3))/spacing*3.14159 - t*0.20));

  // Very thin lines — take inverse near zero
  float w1 = smoothstep(0.10, 0.00, l1);
  float w2 = smoothstep(0.10, 0.00, l2);
  float w3 = smoothstep(0.10, 0.00, l3);

  // Fade with distance from mouse — a "lit" region only
  float md = length(uv - mn);
  float lit = exp(-md*md*1.2);
  float dist = smoothstep(1.1, 0.2, length(uv));

  // Click pulses boost the line weight locally
  float pulseBoost = 0.0;
  for (int i=0;i<8;i++){
    if (i >= u_pulseCount) break;
    vec4 p = u_pulses[i];
    vec2 pp = (p.xy-0.5)*vec2(u_res.x/u_res.y,1.0);
    float age = u_time - p.z;
    if (age<0.0||age>3.0) continue;
    float r = age*0.5;
    float rd = abs(length(uv-pp)-r);
    pulseBoost += exp(-rd*rd*120.0)*(1.0-age/3.0)*0.8;
  }

  vec3 col = bgCol();
  float aLv = u_accent*0.55 * (lit*0.6 + dist*0.4);
  col = mix(col, accentCol(), w1 * aLv);
  col = mix(col, PURPLE,      w2 * aLv * 0.9);
  col = mix(col, RUST,        w3 * aLv * 0.7);
  col = mix(col, accentCol(), pulseBoost*0.9);

  // Quiet dot grid baseline
  float dotSpacing = 0.03 / u_density;
  vec2 gUV = uv / dotSpacing;
  vec2 gF = fract(gUV) - 0.5;
  float dotm = 1.0 - smoothstep(0.04, 0.08, length(gF));
  col = mix(col, mutedCol(), dotm*0.30);

  outColor = vec4(col, 1.0);
}
`;

// -------- JORMUNGANDR (stepped serpent interlace) -----------------------
// Two horizontal ribbons travel as GREEK-KEY / meander paths — only
// vertical, horizontal, and 45° diagonal segments. Over/under crossings
// are carved with hard rectangular masks. No curves anywhere.
// Click response is an octagonal (not circular) pulse that expands
// along H/V/45° axes, matching the shape language.
const FRAG_JORMUN = PRELUDE + `
// Chebyshev-octagon distance — zero at center, grows in octagonal
// shells whose edges are H/V/45°.
float octDist(vec2 p){
  vec2 a = abs(p);
  return max(max(a.x, a.y), (a.x + a.y) * 0.70710678);
}

// Signed distance to an axis-aligned rounded box with zero radius → pure
// rectangle (H/V edges only), returned as 0..1 body mask.
float rectBody(vec2 p, vec2 c, vec2 hs){
  vec2 d = abs(p - c) - hs;
  float inside = step(max(d.x, d.y), 0.0);
  return inside;
}

// Distance to an oriented line SEGMENT at one of 8 cardinal angles.
// angleIdx: 0=E, 1=NE, 2=N, 3=NW, 4=W, 5=SW, 6=S, 7=SE
// returns 1 where we are within half-thickness of the segment and
// between its endpoints, else 0. Hard-edged.
float segMask(vec2 p, vec2 a, vec2 b, float halfT){
  vec2 ab = b - a;
  vec2 ap = p - a;
  float L2 = dot(ab, ab);
  float h = clamp(dot(ap, ab) / L2, 0.0, 1.0);
  vec2 closest = a + ab * h;
  vec2 diff = p - closest;
  float d = max(abs(diff.x), abs(diff.y)); // Chebyshev → hard rect cap
  // For 45° segments, ab is diagonal; use perpendicular distance via
  // rotation (project onto normal). Use dominant component instead:
  // approximate thickness as halfT on either H or V or diagonal.
  return step(d, halfT);
}

// Hard-edged octagonal ring mask (inner/outer bounds in oct-distance).
float octRingMask(vec2 p, float r, float halfW){
  float d = octDist(p);
  return step(abs(d - r), halfW);
}

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5*u_res) / u_res.y;
  float ar = u_res.x / u_res.y;
  float t = u_time * u_speed;
  vec2 mn = (u_mouse - 0.5) * vec2(ar, 1.0);

  vec3 col = bgCol();

  // Step-meander parameters
  // Each ribbon row runs horizontally. In a full period P it steps up by
  // H over the first half, then down by H over the second. Segments are
  // either flat (y=const) or 45° diagonal. Both allowed — this gives the
  // characteristic viking step-pattern.
  float period = 0.30 / u_density;   // horizontal period
  float H = 0.06;                    // step height
  float diagFrac = 0.25;             // fraction of period spent on each diagonal
  float flatFrac = 0.5 - diagFrac;   // flat fraction per half-period
  float ribW = 0.010;                // half-thickness of ribbon body

  // Compute the centerline of ribbon A at x. Use only H/V/45°.
  // phase u in [0,1) across one period
  // Returns both (y-offset, slope) — slope is -1/0/+1 unit.
  // Layout of half-period (u in [0, .5)):
  //   [0,         flatFrac)        : flat at 0
  //   [flatFrac, flatFrac+diagFrac): diag up, slope = H/diagFrac per unit u
  // second half mirrors downward.

  // Three stacked rows
  for (int row = 0; row < 3; row++){
    float yRow = (-0.24) + float(row)*0.24;
    float phaseShift = float(row)*0.13 + t*period*0.9;

    // Ribbon A centerline function
    // We compute y via piecewise segments. Ribbon B is phase-offset by P/2.
    // Because segments are H/V/45° we compute them exactly.
    vec2 p = uv;
    float xA = p.x + phaseShift;
    float xB = xA + period*0.5;  // B is half-period offset => overlays crossings

    // Compute centerline y for ribbon at column x
    // piecewise: helper macro via inline code
    // Using local functions would bloat; inline:
    float ya;
    {
      float u = mod(xA, period) / period;              // 0..1
      if (u < flatFrac) ya = yRow;
      else if (u < 0.5) ya = yRow + H * (u - flatFrac)/diagFrac;
      else if (u < 0.5 + flatFrac) ya = yRow + H;
      else ya = yRow + H * (1.0 - (u - 0.5 - flatFrac)/diagFrac);
    }
    float yb;
    {
      float u = mod(xB, period) / period;
      if (u < flatFrac) yb = yRow;
      else if (u < 0.5) yb = yRow + H * (u - flatFrac)/diagFrac;
      else if (u < 0.5 + flatFrac) yb = yRow + H;
      else yb = yRow + H * (1.0 - (u - 0.5 - flatFrac)/diagFrac);
    }

    // Ribbon body — rectangular cross-section around the centerline.
    // For flat segments: vertical distance |p.y - y| < ribW.
    // For 45° diagonals: perpendicular distance is |p.y - y|*cos(45°).
    // For simplicity and to keep edges HARD, use vertical clipping for
    // both — the result is a ribbon whose top/bottom are parallel to
    // the centerline segment by construction.
    float bA = step(abs(p.y - ya), ribW);
    float bB = step(abs(p.y - yb), ribW);

    // Over/under: A is on top on odd half-periods of A. Use sign of
    // floor(xA/period*2) mod 2.
    float halfPeriodIdx = floor(xA / (period*0.5));
    float aOver = mod(halfPeriodIdx, 2.0);  // 0 or 1

    // Where both ribbons overlap, carve the "under" one with a hard cut.
    float overlap = bA * bB;
    float bAv, bBv;
    if (aOver > 0.5) { bAv = bA; bBv = bB - overlap; }
    else             { bAv = bA - overlap; bBv = bB; }

    // Colors
    vec3 cA = mix(mutedCol(), accentCol(), 0.95);
    vec3 cB = mix(mutedCol(), PURPLE, 0.85);
    float aLv = 0.65 * u_accent;
    col = mix(col, cB, bBv * aLv);
    col = mix(col, cA, bAv * aLv);

    // Thin dark outline on the body top/bottom edges (hard).
    float eA = step(abs(abs(p.y - ya) - ribW), 0.0015);
    float eB = step(abs(abs(p.y - yb) - ribW), 0.0015);
    col = mix(col, fgCol(), (eA*max(bAv,0.0) + eB*max(bBv,0.0)) * 0.4);
  }

  // Quiet dot grid — same as other presets
  float gs = 0.045 / u_density;
  vec2 gUV = uv / gs;
  vec2 gF = fract(gUV) - 0.5;
  float dotm = step(max(abs(gF.x), abs(gF.y)), 0.06);
  col = mix(col, mutedCol(), dotm * 0.18);

  // MOUSE — light a rectangular region (H/V edges only) near cursor
  vec2 toM = uv - mn;
  float spot = step(octDist(toM), 0.25);
  col = mix(col, accentCol(), spot * 0.10 * u_accent);

  // CLICK PULSE — hard-edged octagonal ring expanding from click point
  for (int i=0;i<8;i++){
    if (i >= u_pulseCount) break;
    vec4 pu = u_pulses[i];
    vec2 pp = (pu.xy-0.5)*vec2(ar,1.0);
    float age = u_time - pu.z;
    if (age<0.0||age>3.0) continue;
    float r = age * 0.55;
    float ring = octRingMask(uv - pp, r, 0.008);
    float fade = 1.0 - age/3.0;
    col = mix(col, accentCol(), ring * fade * 0.9);
  }

  outColor = vec4(col, 1.0);
}
`;

// -------- RUNESTONE (octagon chain) -------------------------------------
// Interlocking OCTAGONS on a square lattice. Octagons are defined by
// the chebyshev-octagon distance so all edges are H/V/45°. Parity of
// cell decides over/under. No circles, no curves.
const FRAG_RUNE = PRELUDE + `
// Octagon SDF proxy — 0 at center, equal distance contours are octagons.
float octDist(vec2 p){
  vec2 a = abs(p);
  return max(max(a.x, a.y), (a.x + a.y) * 0.70710678);
}
// Hard octagon-ring mask: 1 if within halfW of oct-distance r, else 0.
float octRing(vec2 p, vec2 c, float r, float halfW){
  float d = octDist(p - c);
  return step(abs(d - r), halfW);
}

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5*u_res) / u_res.y;
  float ar = u_res.x/u_res.y;
  float t = u_time * u_speed;
  vec2 mn = (u_mouse - 0.5) * vec2(ar, 1.0);

  float cellSize = 0.18 / u_density;
  float octR = cellSize * 0.55;
  float halfW = 0.008;

  // Slow stepped drift in H/V direction (no diagonal so content shifts
  // parallel to the grid)
  vec2 drift = vec2(floor(t*0.8)*cellSize*0.0, 0.0);  // keep zero for stability
  vec2 q = uv + drift;

  vec2 cellF = q / cellSize;
  vec2 cellI = floor(cellF);

  vec3 col = bgCol();
  vec3 underCol = mix(mutedCol(), accentCol(), 0.9);
  vec3 overCol  = mix(mutedCol(), PURPLE, 0.80);

  // Draw "under" parity octagons first
  float totalBody = 0.0;
  for (int dy=-1; dy<=1; dy++){
    for (int dx=-1; dx<=1; dx++){
      vec2 ci = cellI + vec2(float(dx), float(dy));
      float parity = mod(ci.x + ci.y, 2.0);
      vec2 c = (ci + 0.5) * cellSize - drift;
      float m = octRing(uv, c, octR, halfW);
      if (parity < 0.5) {
        col = mix(col, underCol, m * 0.85 * u_accent);
        totalBody += m;
      }
    }
  }
  // "Over" parity octagons — draw with a hard knockout around each so
  // their strokes visually cut across the under octagons.
  for (int dy=-1; dy<=1; dy++){
    for (int dx=-1; dx<=1; dx++){
      vec2 ci = cellI + vec2(float(dx), float(dy));
      float parity = mod(ci.x + ci.y, 2.0);
      vec2 c = (ci + 0.5) * cellSize - drift;
      float m = octRing(uv, c, octR, halfW);
      if (parity >= 0.5) {
        // Thin hard-edged knockout halo to enforce over/under
        float halo = octRing(uv, c, octR, halfW*1.9) - m;
        col = mix(col, bgCol(), halo * 0.6);
        col = mix(col, overCol, m * 0.90 * u_accent);
        totalBody += m;
      }
    }
  }

  // Small HARD square studs at each cell center (runic punch marks)
  vec2 cc = fract(q / cellSize) - 0.5;
  float stud = step(max(abs(cc.x), abs(cc.y)) , 0.045);
  col = mix(col, mutedCol(), stud * 0.25 * (1.0 - totalBody));

  // Mouse spotlight — octagonal, hard-edged
  float spot = step(octDist(uv - mn), 0.25);
  col = mix(col, accentCol(), spot * totalBody * 0.35);

  // Click pulse — octagonal ring, hard-edged
  for (int i=0;i<8;i++){
    if (i >= u_pulseCount) break;
    vec4 pu = u_pulses[i];
    vec2 pp = (pu.xy-0.5)*vec2(ar,1.0);
    float age = u_time - pu.z;
    if (age<0.0||age>3.0) continue;
    float r = age * 0.55;
    float ring = octRing(uv, pp, r, 0.008);
    float fade = 1.0 - age/3.0;
    col = mix(col, accentCol(), ring * fade * 0.9);
  }

  outColor = vec4(col, 1.0);
}
`;

// -------- VALKNUT (square + diamond interlace) --------------------------
// Two families of HARD-EDGED squares per cell:
//   A. Axis-aligned square outline
//   B. 45°-rotated square outline (diamond)
// They interlock in a woven pattern — parity decides which sits on top.
// Optional third element: tiny square STUDS at vertex intersections.
// No rotations other than 0° and 45°. No curves.
const FRAG_VALK = PRELUDE + `
float octDist(vec2 p){
  vec2 a = abs(p);
  return max(max(a.x, a.y), (a.x + a.y) * 0.70710678);
}
// Axis-aligned square outline at center c, half-size hs, stroke halfW.
float squareOutline(vec2 p, vec2 c, float hs, float halfW){
  vec2 d = abs(p - c);
  // inside outer square minus inside inner square
  float outer = step(max(d.x, d.y), hs + halfW);
  float inner = step(max(d.x, d.y), hs - halfW);
  return outer - inner;
}
// 45°-rotated square (diamond) outline at center c, "radius" r (distance
// from center to vertex along H/V), stroke halfW.
float diamondOutline(vec2 p, vec2 c, float r, float halfW){
  vec2 d = abs(p - c);
  float m = d.x + d.y;
  float outer = step(m, r + halfW);
  float inner = step(m, r - halfW);
  return outer - inner;
}
float octRing(vec2 p, vec2 c, float r, float halfW){
  float d = octDist(p - c);
  return step(abs(d - r), halfW);
}

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5*u_res) / u_res.y;
  float ar = u_res.x/u_res.y;
  float t = u_time * u_speed;
  vec2 mn = (u_mouse - 0.5) * vec2(ar, 1.0);

  float cell = 0.22 / u_density;
  float sq  = cell * 0.38;      // half-size of axis square
  float dm  = cell * 0.54;      // diamond "radius"
  float halfW = 0.008;

  // Square lattice — diamonds are centered on cell edge midpoints so they
  // weave through the squares.
  vec2 cellF = uv / cell;
  vec2 cellI = floor(cellF);

  vec3 col = bgCol();
  vec3 sqCol = mix(mutedCol(), accentCol(), 0.95);
  vec3 dmCol = mix(mutedCol(), PURPLE, 0.85);
  vec3 stCol = mix(mutedCol(), RUST, 0.70);

  // Slow phase — advances integer count, which flips over/under order
  float phase = mod(floor(t*0.8), 2.0);

  float totalBody = 0.0;
  float aLv = u_accent * 0.75;

  // Draw squares and diamonds from 3x3 neighborhood
  // Two passes: first the "under" family, then the "over" family, with
  // a hard knockout halo applied to the over family so its outline
  // visually cuts the under family.
  // Under family first:
  vec3 underC = (phase < 1.0) ? sqCol : dmCol;
  vec3 overC  = (phase < 1.0) ? dmCol : sqCol;

  for (int dy=-1; dy<=1; dy++){
    for (int dx=-1; dx<=1; dx++){
      vec2 ci = cellI + vec2(float(dx), float(dy));
      vec2 cc = (ci + 0.5) * cell;
      float m;
      if (phase < 1.0) m = squareOutline(uv, cc, sq, halfW);
      else             m = diamondOutline(uv, cc, dm, halfW);
      col = mix(col, underC, m * aLv);
      totalBody += m;
    }
  }
  // Over family — with knockout halo
  for (int dy=-1; dy<=1; dy++){
    for (int dx=-1; dx<=1; dx++){
      vec2 ci = cellI + vec2(float(dx), float(dy));
      vec2 cc = (ci + 0.5) * cell;
      float m, halo;
      if (phase < 1.0) {
        m    = diamondOutline(uv, cc, dm, halfW);
        halo = diamondOutline(uv, cc, dm, halfW*1.9) - m;
      } else {
        m    = squareOutline(uv, cc, sq, halfW);
        halo = squareOutline(uv, cc, sq, halfW*1.9) - m;
      }
      col = mix(col, bgCol(), halo * 0.65);
      col = mix(col, overC, m * aLv);
      totalBody += m;
    }
  }

  // Tiny rust STUDS at cell vertices
  vec2 cc = fract(uv / cell) - 0.5;
  float vertX = step(abs(abs(cc.x) - 0.5), 0.04);
  float vertY = step(abs(abs(cc.y) - 0.5), 0.04);
  float stud = vertX * vertY;
  col = mix(col, stCol, stud * 0.5 * u_accent * (1.0 - totalBody));

  // Mouse — hard-edged octagonal highlight
  float spot = step(octDist(uv - mn), 0.22);
  col = mix(col, accentCol(), spot * totalBody * 0.4);

  // Click pulse — hard-edged octagonal ring
  for (int i=0;i<8;i++){
    if (i >= u_pulseCount) break;
    vec4 pu = u_pulses[i];
    vec2 pp = (pu.xy-0.5)*vec2(ar,1.0);
    float age = u_time - pu.z;
    if (age<0.0||age>3.0) continue;
    float r = age * 0.55;
    float ring = octRing(uv, pp, r, 0.008);
    float fade = 1.0 - age/3.0;
    col = mix(col, accentCol(), ring * fade * 0.9);
  }

  outColor = vec4(col, 1.0);
}
`;

const FRAG_BY_PRESET = {
  ascii: FRAG_ASCII,
  plasma: FRAG_PLASMA,
  ember: FRAG_EMBER,
  weave: FRAG_WEAVE,
  jormun: FRAG_JORMUN,
  rune: FRAG_RUNE,
  valk: FRAG_VALK,
};

function compileShader(gl, src, type){
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)){
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error('Shader compile failed: ' + log);
  }
  return s;
}
function buildProgram(gl, fragSrc){
  const vs = compileShader(gl, VERT, gl.VERTEX_SHADER);
  const fs = compileShader(gl, fragSrc, gl.FRAGMENT_SHADER);
  const p = gl.createProgram();
  gl.attachShader(p, vs); gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)){
    throw new Error('Link failed: ' + gl.getProgramInfoLog(p));
  }
  return p;
}

function ShaderCanvas({ preset = 'ascii', isDark = false, density = 1.0, speed = 1.0, accent = 0.7, onPulse }) {
  const canvasRef = React.useRef(null);
  const stateRef = React.useRef({ mouse: [0.5, 0.5], pulses: [], program: null, uniforms: null, gl: null, fragKey: null });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl2', { antialias: true, premultipliedAlpha: false });
    if (!gl) { console.warn('WebGL2 unavailable'); return; }
    stateRef.current.gl = gl;

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

    let rafId = 0;
    let start = performance.now();

    const ensureProgram = (key) => {
      if (stateRef.current.fragKey === key && stateRef.current.program) return;
      if (stateRef.current.program) gl.deleteProgram(stateRef.current.program);
      const frag = FRAG_BY_PRESET[key] || FRAG_ASCII;
      const program = buildProgram(gl, frag);
      gl.useProgram(program);
      const aPos = gl.getAttribLocation(program, 'a_pos');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      stateRef.current.program = program;
      stateRef.current.fragKey = key;
      stateRef.current.uniforms = {
        u_res:     gl.getUniformLocation(program, 'u_res'),
        u_time:    gl.getUniformLocation(program, 'u_time'),
        u_mouse:   gl.getUniformLocation(program, 'u_mouse'),
        u_dark:    gl.getUniformLocation(program, 'u_dark'),
        u_density: gl.getUniformLocation(program, 'u_density'),
        u_speed:   gl.getUniformLocation(program, 'u_speed'),
        u_accent:  gl.getUniformLocation(program, 'u_accent'),
        u_pulses:  gl.getUniformLocation(program, 'u_pulses[0]'),
        u_pulseCount: gl.getUniformLocation(program, 'u_pulseCount'),
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w*dpr));
      canvas.height = Math.max(1, Math.floor(h*dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

    const listenEl = canvas.parentElement || canvas;
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      stateRef.current.mouse = [
        (e.clientX - r.left) / r.width,
        1.0 - (e.clientY - r.top) / r.height,
      ];
    };
    const onClick = (e) => {
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = 1.0 - (e.clientY - r.top) / r.height;
      const now = (performance.now() - start) / 1000;
      stateRef.current.pulses.push([x, y, now, 0]);
      if (stateRef.current.pulses.length > 8) stateRef.current.pulses.shift();
      onPulse && onPulse();
    };
    listenEl.addEventListener('mousemove', onMove);
    listenEl.addEventListener('click', onClick);

    const render = () => {
      const props = stateRef.current.propsRef;
      ensureProgram(props.preset);
      const U = stateRef.current.uniforms;
      const now = (performance.now() - start) / 1000;
      gl.useProgram(stateRef.current.program);
      gl.uniform2f(U.u_res, canvas.width, canvas.height);
      gl.uniform1f(U.u_time, now);
      gl.uniform2f(U.u_mouse, stateRef.current.mouse[0], stateRef.current.mouse[1]);
      gl.uniform1f(U.u_dark, props.isDark ? 1 : 0);
      gl.uniform1f(U.u_density, props.density);
      gl.uniform1f(U.u_speed, props.speed);
      gl.uniform1f(U.u_accent, props.accent);
      const pulses = stateRef.current.pulses;
      const flat = new Float32Array(32);
      for (let i=0; i<pulses.length && i<8; i++){
        flat[i*4] = pulses[i][0];
        flat[i*4+1] = pulses[i][1];
        flat[i*4+2] = pulses[i][2];
        flat[i*4+3] = pulses[i][3];
      }
      gl.uniform4fv(U.u_pulses, flat);
      gl.uniform1i(U.u_pulseCount, Math.min(pulses.length, 8));

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(render);
    };
    stateRef.current.propsRef = { preset, isDark, density, speed, accent };
    render();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      listenEl.removeEventListener('mousemove', onMove);
      listenEl.removeEventListener('click', onClick);
    };
  }, []);

  React.useEffect(() => {
    if (stateRef.current.propsRef) {
      stateRef.current.propsRef.preset = preset;
      stateRef.current.propsRef.isDark = isDark;
      stateRef.current.propsRef.density = density;
      stateRef.current.propsRef.speed = speed;
      stateRef.current.propsRef.accent = accent;
    }
  }, [preset, isDark, density, speed, accent]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }} />;
}

Object.assign(window, { ShaderCanvas });
