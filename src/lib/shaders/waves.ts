import { PRELUDE } from './common';

// A ripple tank seen from above. Each source draws its wave crests as thin
// rings; where the rings of different sources overlap, a moiré of
// interference fringes appears, and crossings of two crests (constructive
// interference) light up in the accent colour. The mouse is a weak source; a
// click emits a single expanding wavefront.
export const FRAG_WAVES =
	PRELUDE +
	`
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
`;
