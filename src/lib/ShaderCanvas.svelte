<script lang="ts">
	import { onMount } from 'svelte';
	import { VERT, FRAG_BY_PRESET, type Preset } from '$lib/shaders';

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
	let ready = $state(false);

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

		const ensureProgram = (key: Preset) => {
			if (state.fragKey === key && state.program) return;
			if (state.program) gl.deleteProgram(state.program);
			const frag = FRAG_BY_PRESET[key] || FRAG_BY_PRESET.plasma;
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
			if ((e.target as Element).closest('[data-no-pulse]')) return;
			const r = canvas.getBoundingClientRect();
			if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
			const x = (e.clientX - r.left) / r.width;
			const y = 1.0 - (e.clientY - r.top) / r.height;
			const now = (performance.now() - start) / 1000;
			state.pulses.push([x, y, now, 0]);
			if (state.pulses.length > 8) state.pulses.shift();
			onPulse?.();
		};
		window.addEventListener('mousemove', onMove);
		window.addEventListener('click', onClick);

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
			if (!ready) ready = true;
			rafId = requestAnimationFrame(render);
		};
		render();

		return () => {
			cancelAnimationFrame(rafId);
			ro.disconnect();
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('click', onClick);
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="block w-full h-full cursor-crosshair"
	style="opacity: {ready ? 1 : 0}; transition: opacity 0.5s ease;"
></canvas>
