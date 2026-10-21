import{a as k,f as b}from"./CFxUSz3v.js";import{p as J,k as G,e as Z,g as w,s as $,h as ee,l as ce,i as d,r as h,c as m,o as S,j as fe}from"./D5CayJEO.js";import{d as ue,s as E,a as pe}from"./CuZnebPX.js";import{s as ve}from"./C3dOck6N.js";import{i as B}from"./12laGTef.js";import{c as me,b as j,s as de}from"./DC-VQM5L.js";import{p}from"./CXNIYnip.js";import{b as he}from"./DhwTS1Tb.js";import{T as _e,R as ge}from"./C8DXPe-M.js";import{o as xe}from"./B_ZIsD8z.js";import{b as ye}from"./Oj3hxOXP.js";import{a as ke}from"./B6lUHPlo.js";const we=`#version 300 es
in vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`,I=`#version 300 es
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

// The hero title sits on the left; keep that side quieter so text stays legible.
float heroMask(vec2 uv){ return mix(0.35, 1.0, smoothstep(-0.65, 0.3, uv.x)); }

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
`,be=I+`
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
`,Ce=I+`
float profile(float x, float k, float t){
  float cx = 0.36 + 0.04*sin(k*0.37 + t*0.11);
  float env = exp(-pow((x - cx)/0.30, 2.0));
  float n1 = vnoise(vec2(x*9.0, k*1.7 + t*0.35));
  float n2 = vnoise(vec2(x*23.0 + 3.1, k*2.3 - t*0.5));
  float spikes = pow(n1, 3.0)*1.6 + pow(n2, 4.0)*1.3;
  float core = exp(-pow((x - cx - 0.05*sin(k*0.7))/0.065, 2.0)) * (0.55 + 0.45*sin(k*0.9 + t*0.8));
  float floorNoise = (vnoise(vec2(x*42.0, k*5.1 + t)) - 0.5)*0.10;
  return floorNoise + env*(spikes*0.65 + core);
}

float extra(float x, float b, vec2 mn){
  vec2 d = vec2(x, b) - mn;
  float bump = exp(-d.x*d.x*45.0 - d.y*d.y*30.0)*1.3;
  for (int i=0;i<8;i++){
    if (i >= u_pulseCount) break;
    vec4 p = u_pulses[i];
    vec2 pp = (p.xy-0.5)*vec2(u_res.x/u_res.y,1.0);
    float age = u_time - p.z;
    if (age<0.0||age>2.6) continue;
    float r = age*0.5;
    float rd = length(vec2(x,b)-pp) - r;
    bump += exp(-rd*rd*90.0)*(1.0-age/2.6)*1.4;
  }
  return bump;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res) / u_res.y;
  float t = u_time*u_speed;
  vec2 mn = (u_mouse-0.5)*vec2(u_res.x/u_res.y,1.0);
  float px = 1.0/u_res.y;
  float mask = heroMask(uv);

  float dy = 0.026/u_density;
  float A = dy*5.5;
  float k0 = floor(uv.y/dy);

  float hit = 0.0, peak = 0.0;
  // Front (lower) lines first; the first line that either strokes or covers
  // this pixel decides what is seen.
  for (int j = 7; j >= -1; j--){
    float k = k0 - float(j);
    float b = k*dy;
    float h  = A*mask*(profile(uv.x,     k, t) + extra(uv.x,     b, mn));
    float h2 = A*mask*(profile(uv.x+px,  k, t) + extra(uv.x+px,  b, mn));
    float slope = (h2 - h)/px;
    float d = (uv.y - (b + h)) / sqrt(1.0 + slope*slope);
    float s = 1.0 - smoothstep(0.5*px, 1.5*px, abs(d));
    if (s > 0.0){ hit = s; peak = h/(A*mask); break; }
    if (d < 0.0) break;
  }

  vec3 lineCol = mix(fgCol(), accentCol(), smoothstep(0.55, 1.3, peak)*min(1.0, u_accent*2.2));
  float m2 = mask*mask;
  vec3 col = mix(bgCol(), lineCol, hit*mix(0.04, 0.24, m2));
  outColor = vec4(col, 1.0);
}
`,Ae=I+`
const float TAU = 6.28318530718;

// Crest rings of one source: returns line coverage, weighted by amplitude.
float crests(vec2 p, vec2 s, float k, float w, float t, float ph, float px){
  float r = length(p - s);
  float phase = k*r - w*t + ph;
  float d = abs(fract(phase/TAU + 0.5) - 0.5)*TAU/k;
  float amp = 1.0/(1.0 + r*2.2);
  return (1.0 - smoothstep(0.5*px, 1.5*px, d))*amp;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res) / u_res.y;
  float t = u_time*u_speed;
  vec2 mn = (u_mouse-0.5)*vec2(u_res.x/u_res.y,1.0);
  float px = 1.0/u_res.y;
  float mask = heroMask(uv);

  vec2 s1 = vec2(0.38 + 0.16*sin(t*0.07), 0.14 + 0.10*cos(t*0.05));
  vec2 s2 = vec2(0.72 + 0.14*cos(t*0.06), -0.22 + 0.12*sin(t*0.08));
  vec2 s3 = vec2(0.05 + 0.20*sin(t*0.04 + 1.0), 0.32*cos(t*0.03));
  float k = 95.0*u_density;
  float w = 2.4;

  float c1 = crests(uv, s1, k, w, t, 0.0, px);
  float c2 = crests(uv, s2, k, w, t, 1.7, px);
  float c3 = crests(uv, s3, k, w, t, 3.1, px)*0.7;
  float cm = crests(uv, mn, k, w, t, 0.0, px)*0.6*exp(-length(uv-mn)*2.0);

  float pulse = 0.0;
  for (int i=0;i<8;i++){
    if (i >= u_pulseCount) break;
    vec4 p = u_pulses[i];
    vec2 pp = (p.xy-0.5)*vec2(u_res.x/u_res.y,1.0);
    float age = u_time - p.z;
    if (age<0.0||age>3.0) continue;
    float rd = abs(length(uv - pp) - age*0.45);
    pulse += (1.0 - smoothstep(0.6*px, 2.0*px, rd))*(1.0 - age/3.0);
  }

  float ink = clamp(c1 + c2 + c3 + cm, 0.0, 1.0);
  float bright = clamp(c1*c2*3.0 + c1*c3*3.0 + c2*c3*3.0 + pulse, 0.0, 1.0);

  vec3 col = bgCol();
  col = mix(col, fgCol(), ink*0.55*mask);
  col = mix(col, accentCol(), bright*mask*min(1.0, 0.4 + u_accent*1.8));
  outColor = vec4(col, 1.0);
}
`,Se=I+`
const float N_STRIPES = 13.0;
const float MARGIN = 0.05;

// Distance from tile-local q (0..1) to the meander, in tile units.
float meander(vec2 q){
  float s = clamp(floor(q.y*N_STRIPES), 0.0, N_STRIPES-1.0);
  float yc = (s+0.5)/N_STRIPES;
  float lo = MARGIN, hi = 1.0 - MARGIN;
  float dx = q.x < lo ? lo - q.x : (q.x > hi ? q.x - hi : 0.0);
  float d = length(vec2(dx, q.y - yc));
  for (int k=0;k<2;k++){
    float a = s - float(k);   // connector between stripes a and a+1
    if (a < 0.0 || a > N_STRIPES-2.0) continue;
    float xc = mod(a, 2.0) < 0.5 ? hi : lo;
    float y0 = (a+0.5)/N_STRIPES, y1 = (a+1.5)/N_STRIPES;
    float ddy = q.y < y0 ? y0 - q.y : (q.y > y1 ? q.y - y1 : 0.0);
    d = min(d, length(vec2(q.x - xc, ddy)));
  }
  return d;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res) / u_res.y;
  float t = u_time*max(u_speed, 0.05)*2.5;
  vec2 mn = (u_mouse-0.5)*vec2(u_res.x/u_res.y,1.0);
  float px = 1.0/u_res.y;
  float mask = heroMask(uv);

  float T = 0.24/u_density;
  float gap = 0.12;
  vec2 P = uv/T;
  vec2 tile = floor(P);
  vec2 q = (fract(P) - gap)/(1.0 - 2.0*gap);
  vec2 tc = (tile + 0.5)*T;
  float scale = T*(1.0 - 2.0*gap);

  float inside = step(0.0, q.x)*step(q.x, 1.0)*step(0.0, q.y)*step(q.y, 1.0);
  float dW = meander(clamp(q, 0.0, 1.0))*scale;
  float wire = inside*(1.0 - smoothstep(0.5*px, 1.5*px, dW));

  // One possible detection per tile per time slot.
  float period = 1.4;
  float off = hash21(tile + 3.7)*period;
  float tt = t + off;
  float slot = floor(tt/period);
  vec2 key = tile + vec2(slot*7.13, slot*1.91);
  float h1 = hash21(key), h2 = hash21(key + 11.1), h3 = hash21(key + 23.7), h4 = hash21(key + 5.3);
  vec2 md = tc - mn;
  float rate = 0.35 + 0.6*exp(-dot(md, md)*6.0);
  float age = tt - slot*period - h2*period*0.4;

  float hot = 0.0, halo = 0.0;
  if (h1 < rate && age > 0.0){
    float s = floor(h3*N_STRIPES);
    float yc = (s + 0.5)/N_STRIPES;
    float x0 = mix(MARGIN, 1.0 - MARGIN, h4);
    float sameStripe = 1.0 - step(0.5/N_STRIPES, abs(q.y - yc));
    float spread = 0.05 + age*0.55;
    float along = q.x - x0;
    float wideWire = inside*(1.0 - smoothstep(1.0*px, 3.5*px, dW));
    hot = wideWire*sameStripe*exp(-along*along/(spread*spread))*exp(-age*2.4) + wire*exp(-age*10.0)*0.4;
    vec2 hq = q - vec2(x0, yc);
    float hr = length(hq*vec2(1.0, 1.0)) - age*0.35;
    halo = inside*(exp(-dot(hq, hq)*300.0)*exp(-age*6.0) + exp(-hr*hr*2500.0)*exp(-age*5.0)*0.5);
  }

  for (int i=0;i<8;i++){
    if (i >= u_pulseCount) break;
    vec4 p = u_pulses[i];
    vec2 pp = (p.xy-0.5)*vec2(u_res.x/u_res.y,1.0);
    float pa = u_time - p.z;
    if (pa<0.0||pa>2.6) continue;
    float rd = length(tc - pp) - pa*0.55;
    hot += wire*exp(-rd*rd*60.0)*(1.0 - pa/2.6)*0.9;
  }

  float glowAmt = clamp(hot + halo*0.6, 0.0, 1.0)*mask;
  vec3 col = bgCol();
  col = mix(col, fgCol(), wire*0.1*mask);
  col = mix(col, accentCol(), glowAmt*min(1.0, 0.35 + u_accent*1.8));
  outColor = vec4(col, 1.0);
}
`,Ee=I+`
const float TAU = 6.28318530718;

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res) / u_res.y;
  float t = u_time*u_speed;
  vec2 mn = (u_mouse-0.5)*vec2(u_res.x/u_res.y,1.0);
  float px = 1.0/u_res.y;
  float mask = heroMask(uv);

  vec2 C[4];
  C[0] = vec2(0.30 + 0.10*sin(t*0.05),        0.16 + 0.07*cos(t*0.07));
  C[1] = vec2(0.66 + 0.09*cos(t*0.06),       -0.12 + 0.08*sin(t*0.05));
  C[2] = vec2(1.05 + 0.08*sin(t*0.04 + 2.0),  0.28 + 0.06*cos(t*0.06));
  C[3] = vec2(-0.30 + 0.10*cos(t*0.03),       0.38 + 0.05*sin(t*0.04));
  float Q[4];
  Q[0] = 1.0; Q[1] = -1.0; Q[2] = -1.0; Q[3] = 1.0;

  float psi = 0.0, phi = 0.0, nearest = 1e9;
  vec2 E = vec2(0.0);
  for (int i=0;i<4;i++){
    vec2 d = uv - C[i];
    float r2 = dot(d, d) + 1e-7;
    psi += Q[i]*atan(d.y, d.x);
    phi += Q[i]*0.5*log(r2);
    E += Q[i]*d/r2;
    nearest = min(nearest, sqrt(r2));
  }
  float Em = length(E) + 1e-5;

  // Integer charges and a whole number of lines per turn keep the contours
  // continuous across atan's branch cuts.
  float lines = floor(14.0*u_density + 0.5);
  float sp = TAU/lines;
  float flow = t*0.12;
  float dl = abs(fract((psi + flow)/sp + 0.5) - 0.5)*sp/Em;
  float fieldLine = 1.0 - smoothstep(0.55*px, 1.5*px, dl);
  fieldLine *= smoothstep(3.0*px, 9.0*px, sp/Em);   // thin out near the charges

  float esp = 0.55;
  float de = abs(fract(phi/esp + 0.5) - 0.5)*esp/Em;
  float equi = (1.0 - smoothstep(0.5*px, 1.4*px, de))*step(0.0, sin((psi + flow)*lines*2.0));
  equi *= smoothstep(3.0*px, 9.0*px, esp/Em);

  float glow = exp(-dot(uv-mn, uv-mn)*7.0);
  for (int i=0;i<8;i++){
    if (i >= u_pulseCount) break;
    vec4 p = u_pulses[i];
    vec2 pp = (p.xy-0.5)*vec2(u_res.x/u_res.y,1.0);
    float age = u_time - p.z;
    if (age<0.0||age>2.6) continue;
    float rd = length(uv - pp) - age*0.55;
    glow += exp(-rd*rd*120.0)*(1.0 - age/2.6)*1.5;
  }

  vec3 lineCol = mix(fgCol(), accentCol(), clamp(glow*min(1.0, u_accent*2.5), 0.0, 1.0));
  vec3 col = bgCol();
  col = mix(col, fgCol(), equi*0.14*mask);
  col = mix(col, lineCol, fieldLine*0.5*mask);

  // The charges themselves: filled for +, open ring for -.
  for (int i=0;i<4;i++){
    float r = length(uv - C[i]);
    float rr = 0.011;
    float disc = 1.0 - smoothstep(rr - px, rr + px, r);
    float ring = 1.0 - smoothstep(0.6*px, 1.6*px, abs(r - rr));
    float m = Q[i] > 0.0 ? disc : ring;
    col = mix(col, fgCol(), m*0.8*mask);
  }

  outColor = vec4(col, 1.0);
}
`,D=["plasma","pulsar","waves","nanowire","field"],X={plasma:be,pulsar:Ce,waves:Ae,nanowire:Se,field:Ee};function Re(R){const o=D.indexOf(R);return D[(o+1)%D.length]}var Pe=b('<canvas class="block w-full h-full cursor-crosshair"></canvas>');function Te(R,o){J(o,!0);let C=p(o,"preset",3,"plasma"),W=p(o,"isDark",3,!1),Q=p(o,"density",3,1),V=p(o,"speed",3,1),K=p(o,"accent",3,.7),c,P=ee(!1);function x(e,_,g){const u=e.createShader(g);if(e.shaderSource(u,_),e.compileShader(u),!e.getShaderParameter(u,e.COMPILE_STATUS)){const f=e.getShaderInfoLog(u);throw e.deleteShader(u),new Error("Shader compile failed: "+f)}return u}function y(e,_){const g=x(e,we,e.VERTEX_SHADER),u=x(e,_,e.FRAGMENT_SHADER),f=e.createProgram();if(e.attachShader(f,g),e.attachShader(f,u),e.linkProgram(f),!e.getProgramParameter(f,e.LINK_STATUS))throw new Error("Link failed: "+e.getProgramInfoLog(f));return f}xe(()=>{const e=c.getContext("webgl2",{antialias:!0,premultipliedAlpha:!1});if(!e){console.warn("WebGL2 unavailable");return}const _=e.createVertexArray();e.bindVertexArray(_);const g=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,g),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW);let u=0;const f=performance.now(),s={mouse:[.5,.5],pulses:[],fragKey:"",program:null,uniforms:null},U=t=>{if(s.fragKey===t&&s.program)return;s.program&&e.deleteProgram(s.program);const r=X[t]||X.plasma,a=y(e,r);e.useProgram(a);const i=e.getAttribLocation(a,"a_pos");e.enableVertexAttribArray(i),e.vertexAttribPointer(i,2,e.FLOAT,!1,0,0),s.program=a,s.fragKey=t,s.uniforms={u_res:e.getUniformLocation(a,"u_res"),u_time:e.getUniformLocation(a,"u_time"),u_mouse:e.getUniformLocation(a,"u_mouse"),u_dark:e.getUniformLocation(a,"u_dark"),u_density:e.getUniformLocation(a,"u_density"),u_speed:e.getUniformLocation(a,"u_speed"),u_accent:e.getUniformLocation(a,"u_accent"),u_pulses:e.getUniformLocation(a,"u_pulses[0]"),u_pulseCount:e.getUniformLocation(a,"u_pulseCount")}},q=()=>{const t=Math.min(window.devicePixelRatio||1,2),r=c.clientWidth,a=c.clientHeight;c.width=Math.max(1,Math.floor(r*t)),c.height=Math.max(1,Math.floor(a*t)),e.viewport(0,0,c.width,c.height)},L=new ResizeObserver(q);L.observe(c),q();const A=t=>{const r=c.getBoundingClientRect();s.mouse=[(t.clientX-r.left)/r.width,1-(t.clientY-r.top)/r.height]},F=t=>{var N;if(t.target.closest("[data-no-pulse]"))return;const r=c.getBoundingClientRect();if(t.clientX<r.left||t.clientX>r.right||t.clientY<r.top||t.clientY>r.bottom)return;const a=(t.clientX-r.left)/r.width,i=1-(t.clientY-r.top)/r.height,O=(performance.now()-f)/1e3;s.pulses.push([a,i,O,0]),s.pulses.length>8&&s.pulses.shift(),(N=o.onPulse)==null||N.call(o)};window.addEventListener("mousemove",A),window.addEventListener("click",F);const M=()=>{U(C());const t=s.uniforms,r=(performance.now()-f)/1e3;e.useProgram(s.program),e.uniform2f(t.u_res,c.width,c.height),e.uniform1f(t.u_time,r),e.uniform2f(t.u_mouse,s.mouse[0],s.mouse[1]),e.uniform1f(t.u_dark,W()?1:0),e.uniform1f(t.u_density,Q()),e.uniform1f(t.u_speed,V()),e.uniform1f(t.u_accent,K());const a=new Float32Array(32);for(let i=0;i<s.pulses.length&&i<8;i++)a[i*4]=s.pulses[i][0],a[i*4+1]=s.pulses[i][1],a[i*4+2]=s.pulses[i][2],a[i*4+3]=s.pulses[i][3];e.uniform4fv(t.u_pulses,a),e.uniform1i(t.u_pulseCount,Math.min(s.pulses.length,8)),e.drawArrays(e.TRIANGLES,0,6),w(P)||$(P,!0),u=requestAnimationFrame(M)};return M(),()=>{cancelAnimationFrame(u),L.disconnect(),window.removeEventListener("mousemove",A),window.removeEventListener("click",F)}});var T=Pe();ye(T,e=>c=e,()=>c),G(()=>me(T,`opacity: ${w(P)?1:0}; transition: opacity 0.5s ease;`)),k(R,T),Z()}var qe=b('<div class="eyebrow-right svelte-1wfyh2g" data-no-pulse=""><!></div>'),Le=b('<h1 class="hero-title plain svelte-1wfyh2g"> </h1>'),Ne=b('<h1 class="hero-title svelte-1wfyh2g"><!></h1>'),Ie=b('<div class="hero-actions svelte-1wfyh2g" data-no-pulse=""><!></div>'),Ue=b('<div class="transmission-log svelte-1wfyh2g"><span>v0.5</span> <span class="sep svelte-1wfyh2g">·</span> <span>latest: <a class="log-link rs-flourish svelte-1wfyh2g"> </a></span> <button type="button" class="preset-label svelte-1wfyh2g" data-no-pulse="" aria-label="Cycle shader preset"><span class="preset-name svelte-1wfyh2g"> </span> <span class="preset-meta svelte-1wfyh2g"> </span></button></div>'),Fe=b('<section class="hero-band svelte-1wfyh2g"><div class="shader-layer svelte-1wfyh2g"><!></div> <div></div> <div></div> <span class="corner tl svelte-1wfyh2g" aria-hidden="true"></span> <span class="corner tr svelte-1wfyh2g" aria-hidden="true"></span> <span class="corner bl svelte-1wfyh2g" aria-hidden="true"></span> <span class="corner br svelte-1wfyh2g" aria-hidden="true"></span> <div class="hero-content svelte-1wfyh2g"><div class="hero-eyebrow svelte-1wfyh2g"><!></div> <div class="kicker svelte-1wfyh2g"> </div> <!> <p class="hero-lede svelte-1wfyh2g"> </p> <!></div></section>');function je(R,o){J(o,!0);let C=p(o,"isDark",3,!1),W=p(o,"preset",3,"plasma"),Q=p(o,"density",3,.8),V=p(o,"speed",3,.35),K=p(o,"accent",3,.36),c=p(o,"kicker",3,"Something"),P=p(o,"lede",3,"Portfolio and blog of Andrew Mueller — mildly mystical, mostly scientific.");const x=ke[0];let y=ee(ce(W()));const T=()=>{$(y,Re(w(y)),!0)},e=fe(()=>D.indexOf(w(y))+1);var _=Fe(),g=d(_),u=d(g);Te(u,{get preset(){return w(y)},get isDark(){return C()},get density(){return Q()},get speed(){return V()},get accent(){return K()}}),h(g);var f=m(g,2);let s;var U=m(f,2);let q;var L=m(U,10),A=d(L),F=d(A);{var M=n=>{var l=qe(),v=d(l);_e(v,{get isDark(){return C()},get onToggle(){return o.onToggleTheme}}),h(l),k(n,l)};B(F,n=>{o.onToggleTheme&&n(M)})}h(A);var t=m(A,2),r=S(t,!0),a=m(t,2);{var i=n=>{var l=Le(),v=S(l,!0);G(()=>E(v,o.title)),k(n,l)},O=n=>{var l=Ne(),v=d(l);ge(v,{rememberVisitor:!1}),h(l),k(n,l)};B(a,n=>{o.title?n(i):n(O,-1)})}var N=m(a,2),te=S(N,!0),oe=m(N,2);{var ae=n=>{var l=Ie(),v=d(l);ve(v,()=>o.actions),h(l),k(n,l)},se=n=>{var l=Ue(),v=m(d(l),4),Y=m(d(v)),re=S(Y,!0);h(v);var z=m(v,2),H=d(z),ie=S(H,!0),le=m(H,2),ne=S(le);h(z),h(l),G(()=>{de(Y,"href",x?`${he}/blog/${x.slug}`:"#"),E(re,(x==null?void 0:x.title)??"—"),E(ie,w(y)),E(ne,`· ch ${w(e)??""}`)}),pe("click",z,T),k(n,l)};B(oe,n=>{o.actions?n(ae):n(se,-1)})}h(L),h(_),G(()=>{s=j(f,1,"paper-overlay svelte-1wfyh2g",null,s,{dark:C()}),q=j(U,1,"bottom-fade svelte-1wfyh2g",null,q,{dark:C()}),E(r,c()),E(te,P())}),k(R,_),Z()}ue(["click"]);export{je as H};
