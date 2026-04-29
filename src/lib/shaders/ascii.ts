import { PRELUDE } from './common';

// 16 density-ordered printable ASCII characters encoded as 5×7 bitmaps.
// Bit encoding: row[y] bit x corresponds to pixel at column x (0=leftmost).
// Characters: space . ' : - + o x = * # 8 @ W M █
export const FRAG_ASCII =
	PRELUDE +
	`
float glyph(int idx, vec2 uv){
  if (uv.x<0.0||uv.x>1.0||uv.y<0.0||uv.y>1.0) return 0.0;
  int x = int(floor(uv.x*5.0));
  int y = int(floor((1.0-uv.y)*7.0));
  int r[7];
  r[0]=0;r[1]=0;r[2]=0;r[3]=0;r[4]=0;r[5]=0;r[6]=0;

  // 0: space
  if(idx==0){}
  // 1: .  (period, bottom-center)
  else if(idx==1){r[5]=4;r[6]=4;}
  // 2: '  (apostrophe, top-center)
  else if(idx==2){r[0]=4;r[1]=4;}
  // 3: :  (colon)
  else if(idx==3){r[1]=4;r[2]=4;r[4]=4;r[5]=4;}
  // 4: -  (dash, mid-row, 3-wide)
  else if(idx==4){r[3]=14;}
  // 5: +  (plus)
  else if(idx==5){r[1]=4;r[2]=4;r[3]=31;r[4]=4;r[5]=4;}
  // 6: o  (open circle)
  else if(idx==6){r[1]=14;r[2]=17;r[3]=17;r[4]=17;r[5]=14;}
  // 7: x  (ex, symmetric diagonals)
  else if(idx==7){r[1]=17;r[2]=10;r[3]=4;r[4]=10;r[5]=17;}
  // 8: =  (equals, two horizontal bars)
  else if(idx==8){r[2]=31;r[4]=31;}
  // 9: *  (asterisk / snowflake)
  else if(idx==9){r[1]=21;r[2]=14;r[3]=31;r[4]=14;r[5]=21;}
  // 10: # (hash)
  else if(idx==10){r[0]=10;r[1]=10;r[2]=31;r[3]=10;r[4]=31;r[5]=10;r[6]=10;}
  // 11: 8  (figure-eight)
  else if(idx==11){r[0]=14;r[1]=17;r[2]=17;r[3]=14;r[4]=17;r[5]=17;r[6]=14;}
  // 12: @  (at-sign)
  else if(idx==12){r[0]=14;r[1]=17;r[2]=29;r[3]=21;r[4]=29;r[5]=1;r[6]=14;}
  // 13: W
  else if(idx==13){r[1]=17;r[2]=17;r[3]=21;r[4]=21;r[5]=10;}
  // 14: M
  else if(idx==14){r[1]=17;r[2]=27;r[3]=21;r[4]=17;r[5]=17;}
  // 15: full block
  else{r[0]=31;r[1]=31;r[2]=31;r[3]=31;r[4]=31;r[5]=31;r[6]=31;}

  int mask = r[clamp(y,0,6)];
  return float((mask >> x) & 1);
}

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5*u_res) / u_res.y;
  float t = u_time * u_speed;
  vec2 mn = (u_mouse - 0.5) * vec2(u_res.x/u_res.y, 1.0);

  float cellW = 0.016 / u_density;
  float cellH = cellW * 1.75;

  // Cell index and local UV within cell (offset to stay positive)
  vec2 cell  = vec2(floor((uv.x + 4.0)/cellW), floor((uv.y + 4.0)/cellH));
  vec2 inCell = vec2(fract((uv.x + 4.0)/cellW), fract((uv.y + 4.0)/cellH));

  // Sample field at cell center for stable, non-flickering character selection.
  vec2 cc = vec2((cell.x + 0.5)*cellW - 4.0, (cell.y + 0.5)*cellH - 4.0);

  // Domain-warped fbm: first pass guides second for organic, non-repetitive shapes.
  vec2 q = cc*2.2 + vec2(t*0.07, -t*0.05);
  float w1 = fbm(q);
  float field = fbm(q + vec2(w1*1.2, -w1*0.9));

  // Mouse halo.
  float md = length(cc - mn);
  field += exp(-md*md*2.8) * 0.5;

  // Pulse rings.
  for(int i=0;i<8;i++){
    if(i >= u_pulseCount) break;
    vec4 p = u_pulses[i];
    vec2 pp = (p.xy - 0.5)*vec2(u_res.x/u_res.y, 1.0);
    float age = u_time - p.z;
    if(age<0.0||age>3.0) continue;
    float r = age*0.55;
    float rd = abs(length(cc - pp) - r);
    field += exp(-rd*rd*110.0)*(1.0 - age/3.0)*0.85;
  }
  field = clamp(field, 0.0, 1.0);

  // Character selection: map field to 0-15, with a tiny per-cell jitter
  // so adjacent equal-field cells don't look like a uniform wall of the same glyph.
  float jitter = (hash21(cell) - 0.5) * 0.04;
  int charIdx = clamp(int(floor((field + jitter) * 16.0)), 0, 15);
  float bit = glyph(charIdx, inCell);

  // On-brand coloring: muted at low density, accent at peak — same scheme as before.
  vec3 bg = bgCol();
  vec3 glyphCol = mix(mutedCol(), accentCol(), clamp(field * 0.65 * u_accent, 0.0, 0.65));

  // Very faint phosphor glow in empty cells so the grid feels warm, not dead.
  vec3 col = mix(bg, glyphCol * 0.12, (1.0 - bit) * smoothstep(0.15, 0.7, field));
  col = mix(col, glyphCol, bit * smoothstep(0.05, 0.2, field) * 0.92);

  outColor = vec4(col, 1.0);
}
`;
