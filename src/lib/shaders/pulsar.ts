import { PRELUDE } from './common';

// Stacked pulse profiles, after the CP 1919 plot on Unknown Pleasures. Each
// horizontal line is one noisy period of a pulsar signal; lines lower on the
// screen are in front and hide the ones behind. The mouse raises a local peak
// and clicks send a ripple through the stack.
export const FRAG_PULSAR =
	PRELUDE +
	`
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
`;
