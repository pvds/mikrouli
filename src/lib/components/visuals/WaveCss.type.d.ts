/**
 * WaveProps defines the properties for the wave generator.
 */
export type WaveProps = {
	/**
	 * The width of the wave container.
	 * Ensure to include the unit (e.g. px, %, etc.)
	 * @default "100%"
	 */
	width?: string;

	/**
	 * The wave’s total height in px.
	 * Optimal range: 5 to 50
	 * @default 20
	 */
	height?: number;

	/**
	 * The number of wave cycles across the container.
	 * Optimal range: 0.5 to 1.5 (for non-repeating waves).
	 * @default 1
	 */
	frequency?: number;

	/**
	 * The phase shift in degrees.
	 * Allowed range: 0 to 180.
	 * @default 45
	 */
	phase?: number;

	/**
	 * Whether the wave is inverted (flipped vertically).
	 * @default false
	 */
	invert?: boolean;

	/**
	 * Position of the wave relative to the container.
	 * @default false
	 */
	inside?: boolean;

	/**
	 * The wave’s color.
	 */
	color?: string;
};
