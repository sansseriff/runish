import { PRELUDE } from './common';

export const FRAG_NEBULA =
	PRELUDE +
	`
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
`;
