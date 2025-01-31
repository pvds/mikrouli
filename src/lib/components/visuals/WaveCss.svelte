<script>
/** @typedef {import('./WaveCss.type').WaveProps} Wave */
/** @type Wave */
let { width = "100%", height = 20, frequency = 1, phase = 45, invert = false } = $props();

const exponent = 0.6; // higher means steeper exponential curve
const factor = 3.5; // higher means more points
const points = $derived(Math.round(factor * frequency * height ** exponent));

const amplitude = $derived(height / 2);
const offset = $derived(height / 2);
const units = $derived((2 * Math.PI * frequency) / points);
const radPhase = $derived((phase * Math.PI) / 180);
const pathBase = $derived(invert ? "polygon(100% 0%, 0% 0%" : "polygon(100% 100%, 0% 100%");
const clipPath = $derived(() => {
	const pathPoints = Array.from({ length: points + 1 }, (_, i) => {
		const val = offset + amplitude * Math.cos(i * units + radPhase);
		const valY = ((val / height) * 100).toFixed(2);
		const valX = ((i / points) * 100).toFixed(2);
		return `${valX}% ${valY}%`;
	}).join(", ");
	return `${pathBase}, ${pathPoints});`;
});
</script>

<div style="width: {width}; height: {height}px; clip-path: {clipPath()};"
	 class="wave overflow-hidden absolute left-0 {invert ? 'top-full' : 'bottom-full'}  bg-primary-darkest"></div>
