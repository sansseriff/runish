import { PRELUDE } from './common';

export const FRAG_PLASMA =
	PRELUDE +
	`
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
`;
