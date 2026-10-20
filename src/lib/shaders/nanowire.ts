import { PRELUDE } from './common';

// An array of superconducting nanowire detectors: each tile is a meandering
// wire. Photons arrive at random (Poisson-like, per tile and time slot); each
// detection opens a hotspot that spreads along its stripe and fades, with a
// brief flash of the whole wire as the pulse is read out. The cursor is a
// light source that raises the count rate nearby; a click sends a flash of
// light across the array.
export const FRAG_NANOWIRE =
	PRELUDE +
	`
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
`;
