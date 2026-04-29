export const VERT = `#version 300 es
in vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

export const PRELUDE = `#version 300 es
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
`;
