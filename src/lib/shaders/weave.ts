import { PRELUDE } from './common';

export const FRAG_WEAVE =
	PRELUDE +
	`
void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5*u_res) / u_res.y;
  float t = u_time * u_speed;
  vec2 mn = (u_mouse - 0.5) * vec2(u_res.x/u_res.y, 1.0);

  float ang1 = 0.0, ang2 = 1.5707963, ang3 = 0.785398;
  float spacing = 0.05 / u_density;

  float l1 = abs(sin((uv.x*cos(ang1) + uv.y*sin(ang1))/spacing*3.14159 + t*0.25));
  float l2 = abs(sin((uv.x*cos(ang2) + uv.y*sin(ang2))/spacing*3.14159 + t*0.18));
  float l3 = abs(sin((uv.x*cos(ang3) + uv.y*sin(ang3))/spacing*3.14159 - t*0.20));

  float w1 = smoothstep(0.10, 0.00, l1);
  float w2 = smoothstep(0.10, 0.00, l2);
  float w3 = smoothstep(0.10, 0.00, l3);

  float md = length(uv - mn);
  float lit = exp(-md*md*1.2);
  float dist = smoothstep(1.1, 0.2, length(uv));

  float pulseBoost = 0.0;
  for (int i=0;i<8;i++){
    if (i >= u_pulseCount) break;
    vec4 p = u_pulses[i];
    vec2 pp = (p.xy-0.5)*vec2(u_res.x/u_res.y,1.0);
    float age = u_time - p.z;
    if (age<0.0||age>3.0) continue;
    float r = age*0.5;
    float rd = abs(length(uv-pp)-r);
    pulseBoost += exp(-rd*rd*120.0)*(1.0-age/3.0)*0.8;
  }

  vec3 col = bgCol();
  float aLv = u_accent*0.55 * (lit*0.6 + dist*0.4);
  col = mix(col, accentCol(), w1 * aLv);
  col = mix(col, PURPLE,      w2 * aLv * 0.9);
  col = mix(col, RUST,        w3 * aLv * 0.7);
  col = mix(col, accentCol(), pulseBoost*0.9);

  float dotSpacing = 0.03 / u_density;
  vec2 gUV = uv / dotSpacing;
  vec2 gF = fract(gUV) - 0.5;
  float dotm = 1.0 - smoothstep(0.04, 0.08, length(gF));
  col = mix(col, mutedCol(), dotm*0.30);

  outColor = vec4(col, 1.0);
}
`;
