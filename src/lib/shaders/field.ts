import { PRELUDE } from './common';

// Electric field lines of four drifting point charges, drawn like an
// engraving. In 2D the field lines are exactly the contours of the summed
// angle to each charge, so they come out crisp at any zoom. Dashed lines are
// equipotentials. The lines slowly circulate; the mouse tints the lines near
// it and a click sends a bright ring along them.
export const FRAG_FIELD =
	PRELUDE +
	`
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
`;
