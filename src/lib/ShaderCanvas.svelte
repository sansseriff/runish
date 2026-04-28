<script lang="ts">
	import { onMount } from 'svelte';

	type Preset = 'ascii' | 'plasma' | 'ember' | 'weave' | 'jormun' | 'rune' | 'valk';

	let {
		preset = 'plasma' as Preset,
		isDark = false,
		density = 1.0,
		speed = 1.0,
		accent = 0.7,
		onPulse
	}: {
		preset?: Preset;
		isDark?: boolean;
		density?: number;
		speed?: number;
		accent?: number;
		onPulse?: () => void;
	} = $props();

	let canvas: HTMLCanvasElement;

	const VERT = `#version 300 es
in vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

	const PRELUDE = `#version 300 es
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

	const FRAG_PLASMA =
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

	const FRAG_ASCII =
		PRELUDE +
		`
float glyph(int idx, vec2 uv){
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return 0.0;
  int x = int(floor(uv.x*5.0));
  int y = int(floor((1.0-uv.y)*7.0));
  int rows[7]; rows[0]=0;rows[1]=0;rows[2]=0;rows[3]=0;rows[4]=0;rows[5]=0;rows[6]=0;
  if (idx == 0){}
  else if (idx == 1){ rows[6] = 4; }
  else if (idx == 2){ rows[3] = 14; }
  else if (idx == 3){ rows[2] = 4; rows[3] = 14; rows[4] = 4; }
  else if (idx == 4){ rows[1]=1; rows[2]=2; rows[3]=4; rows[4]=8; rows[5]=16; }
  else if (idx == 5){ rows[1]=16; rows[2]=8; rows[3]=4; rows[4]=2; rows[5]=1; }
  else if (idx == 6){ rows[1]=4; rows[2]=14; rows[3]=31; rows[4]=14; rows[5]=4; }
  else if (idx == 7){ rows[2]=10; rows[3]=10; rows[4]=10; }
  else if (idx == 8){ rows[1]=14; rows[2]=17; rows[3]=21; rows[4]=17; rows[5]=14; }
  else if (idx == 9){ rows[0]=31; rows[1]=17; rows[2]=17; rows[3]=17; rows[4]=17; rows[5]=17; rows[6]=31; }
  else if (idx == 10){ rows[0]=4; rows[1]=4; rows[2]=4; rows[3]=31; rows[4]=4; rows[5]=4; rows[6]=4; }
  else if (idx == 11){ rows[2]=21; rows[3]=10; rows[4]=21; }
  else if (idx == 12){ rows[0]=1; rows[1]=2; rows[2]=4; rows[3]=8; rows[4]=16; rows[5]=8; rows[6]=4; }
  else if (idx == 13){ rows[1]=17; rows[2]=10; rows[3]=4; rows[4]=10; rows[5]=17; }
  else if (idx == 14){ rows[0]=31; rows[3]=31; rows[6]=31; }
  else if (idx == 15){ rows[0]=21; rows[1]=10; rows[2]=21; rows[3]=10; rows[4]=21; rows[5]=10; rows[6]=21; }
  int mask = rows[clamp(y,0,6)];
  int bit = (mask >> x) & 1;
  return float(bit);
}

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5*u_res) / u_res.y;
  float t = u_time * u_speed;

  float cellW = 0.014 / u_density;
  float cellH = cellW * 1.7;
  vec2 cell = vec2(floor((uv.x + 2.0)/cellW), floor((uv.y + 2.0)/cellH));
  vec2 inCell = vec2(fract((uv.x + 2.0)/cellW), fract((uv.y + 2.0)/cellH));

  vec2 mn = (u_mouse - 0.5) * vec2(u_res.x/u_res.y, 1.0);
  float d = length(uv - mn);
  float blob = exp(-d*d*3.5);
  float base = fbm(uv*1.4 + vec2(t*0.03, -t*0.02));
  float band = 0.5 + 0.5*sin(uv.x*2.8 + uv.y*1.2 + t*0.25);
  float field = base*0.65 + band*0.2 + blob*0.6;

  for (int i=0;i<8;i++){
    if (i >= u_pulseCount) break;
    vec4 p = u_pulses[i];
    vec2 pp = (p.xy - 0.5) * vec2(u_res.x/u_res.y, 1.0);
    float age = u_time - p.z;
    if (age < 0.0 || age > 3.0) continue;
    float r = age * 0.55;
    float rd = abs(length(uv - pp) - r);
    field += exp(-rd*rd*120.0) * (1.0 - age/3.0) * 0.9;
  }
  field = clamp(field, 0.0, 1.2);

  float jitter = hash21(cell + floor(t*2.0)*0.01);
  int idx = int(floor(clamp(field*11.0 + jitter*1.5, 0.0, 15.9)));
  float mask = smoothstep(0.12, 0.55, field);
  float g = glyph(idx, inCell) * mask;

  vec3 bg = bgCol();
  vec3 glyphCol = mix(mutedCol(), accentCol(), clamp(field*0.6*u_accent, 0.0, 0.6));
  float alpha = g * 0.85;
  vec3 col = mix(bg, glyphCol, alpha);
  outColor = vec4(col, 1.0);
}
`;

	const FRAG_WEAVE =
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

	const FRAG_EMBER =
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

	const FRAG_BY_PRESET: Record<string, string> = {
		ascii: FRAG_ASCII,
		plasma: FRAG_PLASMA,
		ember: FRAG_EMBER,
		weave: FRAG_WEAVE,
		jormun: FRAG_PLASMA,
		rune: FRAG_PLASMA,
		valk: FRAG_PLASMA
	};

	function compileShader(gl: WebGL2RenderingContext, src: string, type: number) {
		const s = gl.createShader(type)!;
		gl.shaderSource(s, src);
		gl.compileShader(s);
		if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
			const log = gl.getShaderInfoLog(s);
			gl.deleteShader(s);
			throw new Error('Shader compile failed: ' + log);
		}
		return s;
	}

	function buildProgram(gl: WebGL2RenderingContext, fragSrc: string) {
		const vs = compileShader(gl, VERT, gl.VERTEX_SHADER);
		const fs = compileShader(gl, fragSrc, gl.FRAGMENT_SHADER);
		const p = gl.createProgram()!;
		gl.attachShader(p, vs);
		gl.attachShader(p, fs);
		gl.linkProgram(p);
		if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
			throw new Error('Link failed: ' + gl.getProgramInfoLog(p));
		}
		return p;
	}

	onMount(() => {
		const gl = canvas.getContext('webgl2', { antialias: true, premultipliedAlpha: false });
		if (!gl) {
			console.warn('WebGL2 unavailable');
			return;
		}

		const vao = gl.createVertexArray();
		gl.bindVertexArray(vao);
		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
			gl.STATIC_DRAW
		);

		let rafId = 0;
		const start = performance.now();
		const state = {
			mouse: [0.5, 0.5] as [number, number],
			pulses: [] as Array<[number, number, number, number]>,
			fragKey: '' as string,
			program: null as WebGLProgram | null,
			uniforms: null as Record<string, WebGLUniformLocation | null> | null
		};

		const ensureProgram = (key: string) => {
			if (state.fragKey === key && state.program) return;
			if (state.program) gl.deleteProgram(state.program);
			const frag = FRAG_BY_PRESET[key] || FRAG_PLASMA;
			const program = buildProgram(gl, frag);
			gl.useProgram(program);
			const aPos = gl.getAttribLocation(program, 'a_pos');
			gl.enableVertexAttribArray(aPos);
			gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
			state.program = program;
			state.fragKey = key;
			state.uniforms = {
				u_res: gl.getUniformLocation(program, 'u_res'),
				u_time: gl.getUniformLocation(program, 'u_time'),
				u_mouse: gl.getUniformLocation(program, 'u_mouse'),
				u_dark: gl.getUniformLocation(program, 'u_dark'),
				u_density: gl.getUniformLocation(program, 'u_density'),
				u_speed: gl.getUniformLocation(program, 'u_speed'),
				u_accent: gl.getUniformLocation(program, 'u_accent'),
				u_pulses: gl.getUniformLocation(program, 'u_pulses[0]'),
				u_pulseCount: gl.getUniformLocation(program, 'u_pulseCount')
			};
		};

		const resize = () => {
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const w = canvas.clientWidth,
				h = canvas.clientHeight;
			canvas.width = Math.max(1, Math.floor(w * dpr));
			canvas.height = Math.max(1, Math.floor(h * dpr));
			gl.viewport(0, 0, canvas.width, canvas.height);
		};
		const ro = new ResizeObserver(resize);
		ro.observe(canvas);
		resize();

		const onMove = (e: MouseEvent) => {
			const r = canvas.getBoundingClientRect();
			state.mouse = [(e.clientX - r.left) / r.width, 1.0 - (e.clientY - r.top) / r.height];
		};
		const onClick = (e: MouseEvent) => {
			const r = canvas.getBoundingClientRect();
			const x = (e.clientX - r.left) / r.width;
			const y = 1.0 - (e.clientY - r.top) / r.height;
			const now = (performance.now() - start) / 1000;
			state.pulses.push([x, y, now, 0]);
			if (state.pulses.length > 8) state.pulses.shift();
			onPulse?.();
		};
		canvas.addEventListener('mousemove', onMove);
		canvas.addEventListener('click', onClick);

		const render = () => {
			ensureProgram(preset);
			const U = state.uniforms!;
			const now = (performance.now() - start) / 1000;
			gl.useProgram(state.program);
			gl.uniform2f(U.u_res, canvas.width, canvas.height);
			gl.uniform1f(U.u_time, now);
			gl.uniform2f(U.u_mouse, state.mouse[0], state.mouse[1]);
			gl.uniform1f(U.u_dark, isDark ? 1 : 0);
			gl.uniform1f(U.u_density, density);
			gl.uniform1f(U.u_speed, speed);
			gl.uniform1f(U.u_accent, accent);
			const flat = new Float32Array(32);
			for (let i = 0; i < state.pulses.length && i < 8; i++) {
				flat[i * 4] = state.pulses[i][0];
				flat[i * 4 + 1] = state.pulses[i][1];
				flat[i * 4 + 2] = state.pulses[i][2];
				flat[i * 4 + 3] = state.pulses[i][3];
			}
			gl.uniform4fv(U.u_pulses, flat);
			gl.uniform1i(U.u_pulseCount, Math.min(state.pulses.length, 8));
			gl.drawArrays(gl.TRIANGLES, 0, 6);
			rafId = requestAnimationFrame(render);
		};
		render();

		return () => {
			cancelAnimationFrame(rafId);
			ro.disconnect();
			canvas.removeEventListener('mousemove', onMove);
			canvas.removeEventListener('click', onClick);
		};
	});
</script>

<canvas bind:this={canvas} class="block w-full h-full cursor-crosshair"></canvas>
