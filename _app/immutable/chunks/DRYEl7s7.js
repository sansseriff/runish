import{f as z,a as V}from"./BEI0HlKk.js";import{p as W,t as j,a as K,y as _,aw as Y,ai as X,ah as $,s as d,c as u,r as f,ac as ee}from"./BodG447m.js";import{d as te,a as ae,s as B}from"./CBbIHPiK.js";import{i as re}from"./B38__9IA.js";import{a as oe,b as H,s as se}from"./i4F9FLqN.js";import{p}from"./CVx_iLM3.js";import{b as le}from"./MyvVck1U.js";import{R as ie,T as ne}from"./omwHgRGy.js";import{o as ce}from"./BzpCoxBC.js";import{b as ue}from"./C99IfFkB.js";import{p as fe}from"./21GyS3Cj.js";const de=`#version 300 es
in vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`,G=`#version 300 es
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
vec3 PURPLE = vec3(0.604, 0.384, 0.612);
vec3 RUST   = vec3(0.624, 0.302, 0.302);
vec3 MOSS   = vec3(0.588, 0.365, 0.153);

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
`,pe=G+`
void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5*u_res) / u_res.y;
  float t = u_time * u_speed;
  vec2 mn = (u_mouse - 0.5) * vec2(u_res.x/u_res.y, 1.0);

  vec2 q = uv*1.2 + vec2(t*0.05, -t*0.04);
  float n1 = fbm(q);
  float n2 = fbm(q*1.3 + vec2(n1*1.5, -n1));
  float n  = fbm(q + vec2(n2, -n2)*1.1);

  float md = length(uv - mn);
  n += exp(-md*md*3.0) * 0.4;

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

  vec3 a = accentCol();
  vec3 pur = PURPLE;
  vec3 wash = mix(a, pur, smoothstep(0.35, 0.85, n));
  wash = mix(mutedCol(), wash, 0.55);

  float stepped = n*6.0;
  float contour = 1.0 - smoothstep(0.0, 0.03, abs(fract(stepped) - 0.5));
  vec3 col = bgCol();
  col = mix(col, wash, smoothstep(0.15, 0.9, n) * 0.45 * u_accent);
  col = mix(col, fgCol(), contour*0.18);

  float dotSpacing = 0.035 / u_density;
  vec2 gUV = uv / dotSpacing;
  vec2 gF = fract(gUV) - 0.5;
  float dotm = 1.0 - smoothstep(0.04, 0.08, length(gF));
  col = mix(col, mutedCol(), dotm*0.28);

  outColor = vec4(col, 1.0);
}
`,ve=G+`
// Drifting particle field. Each cell carries one particle flowing on a slow
// noise field. Large-scale clump noise biases particles toward local centers,
// creating dense clouds separated by voids. Mouse attracts; clicks send an
// outgoing ring that warps the coordinate space, bowing the field outward.

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5*u_res) / u_res.y;
  float t = u_time * u_speed;
  vec2 mn = (u_mouse - 0.5) * vec2(u_res.x/u_res.y, 1.0);

  // Pulse-driven domain warp.
  vec2 sampleUV = uv;
  for(int k=0;k<8;k++){
    if(k >= u_pulseCount) break;
    vec4 pl = u_pulses[k];
    vec2 pp = (pl.xy - 0.5)*vec2(u_res.x/u_res.y, 1.0);
    float age = u_time - pl.z;
    if(age<0.0||age>2.6) continue;
    vec2 dir = uv - pp;
    float dd = length(dir) + 1e-5;
    float r = age*0.55;
    float ring = exp(-(dd-r)*(dd-r)*55.0)*(1.0 - age/2.6);
    sampleUV -= (dir/dd)*ring*0.035;
  }

  float gridSize = 0.075 / u_density;
  vec2 P = sampleUV / gridSize;
  vec2 cell = floor(P);
  vec2 fp = fract(P);

  float minD = 1e9, secondD = 1e9;
  vec2 minP = vec2(0.0), secondP = vec2(0.0);
  vec3 partCol = vec3(0.0);
  float partGlow = 0.6;
  float partTwinkle = 0.0;

  for(int j=-1;j<=1;j++){
    for(int i=-1;i<=1;i++){
      vec2 nb = vec2(float(i), float(j));
      vec2 c = cell + nb;
      float h1 = hash21(c);
      float h2 = hash21(c + vec2(17.3, 31.1));
      float h3 = hash21(c + vec2(7.71, 51.7));
      float h4 = hash21(c + vec2(63.1, 11.9));

      // Large-scale clump noise: pulls particles toward clump centers.
      // Low clumpN → particle stays near cell center (dense cluster).
      // High clumpN → particle wanders to full cell extent (void space).
      float clumpN = vnoise(c * 0.28 + vec2(t*0.008, t*0.005));
      float spread = 0.15 + clumpN * 0.72;

      vec2 base = vec2(0.5) + (vec2(h1, h2) - 0.5) * spread;
      float drift = 0.25 + h3*0.45;
      vec2 flow = vec2(
        sin(t*drift + h1*6.2831 + h2*2.7),
        cos(t*drift*0.92 + h2*6.2831 + h1*2.4)
      );
      vec2 cellOffset = base + flow*(0.20 * spread);

      vec2 partPos = (cell + nb + cellOffset)*gridSize;

      // Mouse attraction.
      vec2 toMouse = mn - partPos;
      float md = length(toMouse) + 1e-5;
      float pull = exp(-md*md*3.0)*0.05;
      partPos += (toMouse/md)*pull;

      float d = length(uv - partPos);
      if(d < minD){
        secondD = minD; secondP = minP;
        minD = d; minP = partPos;

        float hp = fract(h4 + t*0.015);
        vec3 BLUE = mix(ACCENT_500, ACCENT_300, 0.65);
        vec3 RED  = vec3(0.62, 0.30, 0.34);
        vec3 PUR  = mix(PURPLE, vec3(0.42, 0.32, 0.58), 0.4);
        partCol = (hp < 0.45) ? BLUE : (hp < 0.78) ? PUR : RED;
        partGlow = 0.55 + h3*0.45;
        partTwinkle = 0.5 + 0.5*sin(t*1.6 + h1*9.0 + h2*4.0);
      } else if(d < secondD){
        secondD = d; secondP = partPos;
      }
    }
  }

  // Core dot + soft halo, modulated by twinkle.
  float core = exp(-minD*minD*5500.0);
  float halo = exp(-minD*minD*520.0)*0.28;
  float lum = (core + halo)*partGlow*(0.55 + partTwinkle*0.45);

  // Filament between two nearest particles, fading with pair separation.
  vec2 ab = secondP - minP;
  float lenAB2 = dot(ab,ab) + 1e-9;
  float tline = clamp(dot(uv - minP, ab)/lenAB2, 0.0, 1.0);
  float lineD = length(uv - (minP + ab*tline));
  float pairLen = sqrt(lenAB2);
  float pairFade = smoothstep(gridSize*1.8, gridSize*0.5, pairLen);
  float filament = exp(-lineD*lineD*2000.0)*pairFade*0.28;

  // Cursor glow.
  vec2 dmn = uv - mn;
  float mouseGlow = exp(-dot(dmn,dmn)*1.7)*0.13;

  // Subtle background fbm wash.
  float wash = fbm(uv*1.4 + vec2(t*0.04, -t*0.03));
  vec3 washCol = mix(accentCol(), PURPLE, smoothstep(0.3, 0.85, wash));
  washCol = mix(mutedCol(), washCol, 0.45);

  vec3 col = bgCol();
  col = mix(col, washCol, smoothstep(0.25, 0.85, wash)*0.18*u_accent);
  col = mix(col, partCol, clamp(filament*u_accent, 0.0, 0.55));
  col = mix(col, partCol, clamp(lum*u_accent*1.35, 0.0, 0.95));
  col += partCol*mouseGlow*u_accent*0.55;

  // Pulse hairlines.
  for(int k=0;k<8;k++){
    if(k >= u_pulseCount) break;
    vec4 pl = u_pulses[k];
    vec2 pp = (pl.xy - 0.5)*vec2(u_res.x/u_res.y, 1.0);
    float age = u_time - pl.z;
    if(age<0.0||age>2.6) continue;
    float r = age*0.55;
    float rd = length(uv - pp) - r;
    float ring = exp(-rd*rd*220.0)*(1.0 - age/2.6);
    col = mix(col, partCol, ring*0.55*u_accent);
  }

  outColor = vec4(col, 1.0);
}
`,me=G+`
float glyph(int idx, vec2 uv){
  if (uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0) return 0.0;
  int x = int(floor(uv.x*5.0));
  int y = int(floor((1.0-uv.y)*7.0));
  int r[7];
  r[0]=0;r[1]=0;r[2]=0;r[3]=0;r[4]=0;r[5]=0;r[6]=0;

  // 0: space
  if(idx==0){}
  // 1: .  (period, bottom-center)
  else if(idx==1){r[5]=4;r[6]=4;}
  // 2: '  (apostrophe, top-center)
  else if(idx==2){r[0]=4;r[1]=4;}
  // 3: :  (colon)
  else if(idx==3){r[1]=4;r[2]=4;r[4]=4;r[5]=4;}
  // 4: -  (dash, mid-row, 3-wide)
  else if(idx==4){r[3]=14;}
  // 5: +  (plus)
  else if(idx==5){r[1]=4;r[2]=4;r[3]=31;r[4]=4;r[5]=4;}
  // 6: o  (open circle)
  else if(idx==6){r[1]=14;r[2]=17;r[3]=17;r[4]=17;r[5]=14;}
  // 7: x  (ex, symmetric diagonals)
  else if(idx==7){r[1]=17;r[2]=10;r[3]=4;r[4]=10;r[5]=17;}
  // 8: =  (equals, two horizontal bars)
  else if(idx==8){r[2]=31;r[4]=31;}
  // 9: *  (asterisk / snowflake)
  else if(idx==9){r[1]=21;r[2]=14;r[3]=31;r[4]=14;r[5]=21;}
  // 10: # (hash)
  else if(idx==10){r[0]=10;r[1]=10;r[2]=31;r[3]=10;r[4]=31;r[5]=10;r[6]=10;}
  // 11: 8  (figure-eight)
  else if(idx==11){r[0]=14;r[1]=17;r[2]=17;r[3]=14;r[4]=17;r[5]=17;r[6]=14;}
  // 12: @  (at-sign)
  else if(idx==12){r[0]=14;r[1]=17;r[2]=29;r[3]=21;r[4]=29;r[5]=1;r[6]=14;}
  // 13: W
  else if(idx==13){r[1]=17;r[2]=17;r[3]=21;r[4]=21;r[5]=10;}
  // 14: M
  else if(idx==14){r[1]=17;r[2]=27;r[3]=21;r[4]=17;r[5]=17;}
  // 15: full block
  else{r[0]=31;r[1]=31;r[2]=31;r[3]=31;r[4]=31;r[5]=31;r[6]=31;}

  int mask = r[clamp(y,0,6)];
  return float((mask >> x) & 1);
}

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5*u_res) / u_res.y;
  float t = u_time * u_speed;
  vec2 mn = (u_mouse - 0.5) * vec2(u_res.x/u_res.y, 1.0);

  float cellW = 0.016 / u_density;
  float cellH = cellW * 1.75;

  // Cell index and local UV within cell (offset to stay positive)
  vec2 cell  = vec2(floor((uv.x + 4.0)/cellW), floor((uv.y + 4.0)/cellH));
  vec2 inCell = vec2(fract((uv.x + 4.0)/cellW), fract((uv.y + 4.0)/cellH));

  // Sample field at cell center for stable, non-flickering character selection.
  vec2 cc = vec2((cell.x + 0.5)*cellW - 4.0, (cell.y + 0.5)*cellH - 4.0);

  // Domain-warped fbm: first pass guides second for organic, non-repetitive shapes.
  vec2 q = cc*2.2 + vec2(t*0.07, -t*0.05);
  float w1 = fbm(q);
  float field = fbm(q + vec2(w1*1.2, -w1*0.9));

  // Mouse halo.
  float md = length(cc - mn);
  field += exp(-md*md*2.8) * 0.5;

  // Pulse rings.
  for(int i=0;i<8;i++){
    if(i >= u_pulseCount) break;
    vec4 p = u_pulses[i];
    vec2 pp = (p.xy - 0.5)*vec2(u_res.x/u_res.y, 1.0);
    float age = u_time - p.z;
    if(age<0.0||age>3.0) continue;
    float r = age*0.55;
    float rd = abs(length(cc - pp) - r);
    field += exp(-rd*rd*110.0)*(1.0 - age/3.0)*0.85;
  }
  field = clamp(field, 0.0, 1.0);

  // Character selection: map field to 0-15, with a tiny per-cell jitter
  // so adjacent equal-field cells don't look like a uniform wall of the same glyph.
  float jitter = (hash21(cell) - 0.5) * 0.04;
  int charIdx = clamp(int(floor((field + jitter) * 16.0)), 0, 15);
  float bit = glyph(charIdx, inCell);

  // On-brand coloring: muted at low density, accent at peak — same scheme as before.
  vec3 bg = bgCol();
  vec3 glyphCol = mix(mutedCol(), accentCol(), clamp(field * 0.65 * u_accent, 0.0, 0.65));

  // Very faint phosphor glow in empty cells so the grid feels warm, not dead.
  vec3 col = mix(bg, glyphCol * 0.12, (1.0 - bit) * smoothstep(0.15, 0.7, field));
  col = mix(col, glyphCol, bit * smoothstep(0.05, 0.2, field) * 0.92);

  outColor = vec4(col, 1.0);
}
`,L=["plasma","nebula","ascii"],O={plasma:pe,nebula:ve,ascii:me};function he(C){const s=L.indexOf(C);return L[(s+1)%L.length]}var ge=z('<canvas class="block w-full h-full cursor-crosshair"></canvas>');function _e(C,s){W(s,!0);let w=p(s,"preset",3,"plasma"),T=p(s,"isDark",3,!1),U=p(s,"density",3,1),D=p(s,"speed",3,1),F=p(s,"accent",3,.7),l,v=Y(!1);function k(e,g,m){const n=e.createShader(m);if(e.shaderSource(n,g),e.compileShader(n),!e.getShaderParameter(n,e.COMPILE_STATUS)){const c=e.getShaderInfoLog(n);throw e.deleteShader(n),new Error("Shader compile failed: "+c)}return n}function M(e,g){const m=k(e,de,e.VERTEX_SHADER),n=k(e,g,e.FRAGMENT_SHADER),c=e.createProgram();if(e.attachShader(c,m),e.attachShader(c,n),e.linkProgram(c),!e.getProgramParameter(c,e.LINK_STATUS))throw new Error("Link failed: "+e.getProgramInfoLog(c));return c}ce(()=>{const e=l.getContext("webgl2",{antialias:!0,premultipliedAlpha:!1});if(!e){console.warn("WebGL2 unavailable");return}const g=e.createVertexArray();e.bindVertexArray(g);const m=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,m),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW);let n=0;const c=performance.now(),r={mouse:[.5,.5],pulses:[],fragKey:"",program:null,uniforms:null},A=t=>{if(r.fragKey===t&&r.program)return;r.program&&e.deleteProgram(r.program);const o=O[t]||O.plasma,a=M(e,o);e.useProgram(a);const i=e.getAttribLocation(a,"a_pos");e.enableVertexAttribArray(i),e.vertexAttribPointer(i,2,e.FLOAT,!1,0,0),r.program=a,r.fragKey=t,r.uniforms={u_res:e.getUniformLocation(a,"u_res"),u_time:e.getUniformLocation(a,"u_time"),u_mouse:e.getUniformLocation(a,"u_mouse"),u_dark:e.getUniformLocation(a,"u_dark"),u_density:e.getUniformLocation(a,"u_density"),u_speed:e.getUniformLocation(a,"u_speed"),u_accent:e.getUniformLocation(a,"u_accent"),u_pulses:e.getUniformLocation(a,"u_pulses[0]"),u_pulseCount:e.getUniformLocation(a,"u_pulseCount")}},y=()=>{const t=Math.min(window.devicePixelRatio||1,2),o=l.clientWidth,a=l.clientHeight;l.width=Math.max(1,Math.floor(o*t)),l.height=Math.max(1,Math.floor(a*t)),e.viewport(0,0,l.width,l.height)},E=new ResizeObserver(y);E.observe(l),y();const R=t=>{const o=l.getBoundingClientRect();r.mouse=[(t.clientX-o.left)/o.width,1-(t.clientY-o.top)/o.height]},x=t=>{var b;if(t.target.closest("[data-no-pulse]"))return;const o=l.getBoundingClientRect();if(t.clientX<o.left||t.clientX>o.right||t.clientY<o.top||t.clientY>o.bottom)return;const a=(t.clientX-o.left)/o.width,i=1-(t.clientY-o.top)/o.height,P=(performance.now()-c)/1e3;r.pulses.push([a,i,P,0]),r.pulses.length>8&&r.pulses.shift(),(b=s.onPulse)==null||b.call(s)};window.addEventListener("mousemove",R),window.addEventListener("click",x);const S=()=>{A(w());const t=r.uniforms,o=(performance.now()-c)/1e3;e.useProgram(r.program),e.uniform2f(t.u_res,l.width,l.height),e.uniform1f(t.u_time,o),e.uniform2f(t.u_mouse,r.mouse[0],r.mouse[1]),e.uniform1f(t.u_dark,T()?1:0),e.uniform1f(t.u_density,U()),e.uniform1f(t.u_speed,D()),e.uniform1f(t.u_accent,F());const a=new Float32Array(32);for(let i=0;i<r.pulses.length&&i<8;i++)a[i*4]=r.pulses[i][0],a[i*4+1]=r.pulses[i][1],a[i*4+2]=r.pulses[i][2],a[i*4+3]=r.pulses[i][3];e.uniform4fv(t.u_pulses,a),e.uniform1i(t.u_pulseCount,Math.min(r.pulses.length,8)),e.drawArrays(e.TRIANGLES,0,6),_(v)||X(v,!0),n=requestAnimationFrame(S)};return S(),()=>{cancelAnimationFrame(n),E.disconnect(),window.removeEventListener("mousemove",R),window.removeEventListener("click",x)}});var h=ge();ue(h,e=>l=e,()=>l),j(()=>oe(h,`opacity: ${_(v)?1:0}; transition: opacity 0.5s ease;`)),V(C,h),K()}var we=z('<div class="eyebrow-right svelte-1wfyh2g" data-no-pulse=""><!></div>'),ye=z('<section class="hero-band svelte-1wfyh2g"><div class="shader-layer svelte-1wfyh2g"><!></div> <div></div> <div></div> <span class="corner tl svelte-1wfyh2g" aria-hidden="true"></span> <span class="corner tr svelte-1wfyh2g" aria-hidden="true"></span> <span class="corner bl svelte-1wfyh2g" aria-hidden="true"></span> <span class="corner br svelte-1wfyh2g" aria-hidden="true"></span> <div class="hero-content svelte-1wfyh2g"><div class="hero-eyebrow svelte-1wfyh2g"><div class="eyebrow-left svelte-1wfyh2g"><span class="diamond-mark svelte-1wfyh2g" aria-hidden="true"></span> <span>live</span></div> <!></div> <div class="kicker svelte-1wfyh2g">Something</div> <h1 class="hero-title svelte-1wfyh2g"><!></h1> <p class="hero-lede svelte-1wfyh2g">Portfolio and blog of Andrew Mueller — mildly mystical, mostly scientific.</p> <div class="transmission-log svelte-1wfyh2g"><span>v0.5</span> <span class="sep svelte-1wfyh2g">·</span> <span>latest: <a class="log-link rs-flourish svelte-1wfyh2g"> </a></span> <span class="sep svelte-1wfyh2g">·</span> <span>click anywhere in the field to emit a pulse</span> <button type="button" class="preset-label svelte-1wfyh2g" data-no-pulse="" aria-label="Cycle shader preset"><span class="preset-name svelte-1wfyh2g"> </span> <span class="preset-meta svelte-1wfyh2g"> </span></button></div></div></section>');function Ue(C,s){W(s,!0);let w=p(s,"isDark",3,!1),T=p(s,"preset",3,"plasma"),U=p(s,"density",3,.8),D=p(s,"speed",3,.35),F=p(s,"accent",3,.36);const l=fe[0];let v=Y($(T()));const k=()=>{X(v,he(_(v)),!0)},M=ee(()=>L.indexOf(_(v))+1);var h=ye(),e=u(h),g=u(e);_e(g,{get preset(){return _(v)},get isDark(){return w()},get density(){return U()},get speed(){return D()},get accent(){return F()}}),f(e);var m=d(e,2);let n;var c=d(m,2);let r;var A=d(c,10),y=u(A),E=d(u(y),2);{var R=N=>{var I=we(),Z=u(I);ne(Z,{get isDark(){return w()},get onToggle(){return s.onToggleTheme}}),f(I),V(N,I)};re(E,N=>{s.onToggleTheme&&N(R)})}f(y);var x=d(y,4),S=u(x);ie(S,{rememberVisitor:!1}),f(x);var t=d(x,4),o=d(u(t),4),a=d(u(o)),i=u(a,!0);f(a),f(o);var P=d(o,6),b=u(P),J=u(b,!0);f(b);var q=d(b,2),Q=u(q);f(q),f(P),f(t),f(A),f(h),j(()=>{n=H(m,1,"paper-overlay svelte-1wfyh2g",null,n,{dark:w()}),r=H(c,1,"bottom-fade svelte-1wfyh2g",null,r,{dark:w()}),se(a,"href",l?`${le}/blog/${l.slug}`:"#"),B(i,(l==null?void 0:l.title)??"—"),B(J,_(v)),B(Q,`· ch ${_(M)??""}`)}),ae("click",P,k),V(C,h),K()}te(["click"]);export{Ue as H};
