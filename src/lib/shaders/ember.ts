import { PRELUDE } from './common';

export const FRAG_EMBER =
	PRELUDE +
	`
void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5*u_res) / u_res.y;
  float t = u_time * u_speed;
  vec2 mn = (u_mouse - 0.5) * vec2(u_res.x/u_res.y, 1.0);

  float a1 = sin(uv.y*8.0 + t*0.3 + sin(uv.x*2.0 + t*0.2)*0.6);
  float a2 = sin(uv.y*16.0 + t*0.15 - uv.x*3.0);
  float bands = 0.5 + 0.5*(a1*0.7 + a2*0.3);

  float md = length(uv - mn);
  float intensity = exp(-md*md*1.6) * 0.7 + 0.2;

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

  vec3 cool = accentCol();
  vec3 warm = RUST;
  vec3 wash = mix(cool, warm, smoothstep(0.3, 0.9, bands));
  wash = mix(mutedCol(), wash, 0.55);

  vec3 col = bgCol();
  col = mix(col, wash, intensity * bands * 0.50 * u_accent);

  float axisBand = smoothstep(0.002, 0.0, abs(fract(uv.y*8.0) - 0.5));
  col = mix(col, mutedCol(), axisBand * 0.12);

  float dotSpacing = 0.035 / u_density;
  vec2 gUV = uv / dotSpacing;
  vec2 gF = fract(gUV) - 0.5;
  float dotm = 1.0 - smoothstep(0.04, 0.08, length(gF));
  col = mix(col, mutedCol(), dotm*0.25);

  outColor = vec4(col, 1.0);
}
`;
