/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
		"./src/**/*.{js,jsx,ts,tsx}",
	],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				// Dark Premium Base Colors
				'dark-bg': '#0A0F1A',
				'dark-surface': '#1E293B',
				'dark-elevated': '#283548',
				'dark-text': '#F8FAFC',
				'dark-text-secondary': '#94A3B8',
				'dark-text-muted': '#64748B',

				// Vibrant Accents
				'accent-cyan': '#22D3EE',
				'accent-cyan-dark': '#0891B2',
				'accent-violet': '#A78BFA',
				'accent-violet-dark': '#7C3AED',
				'accent-emerald': '#34D399',
				'accent-emerald-dark': '#059669',
				'accent-rose': '#FB7185',
				'accent-rose-dark': '#E11D48',

				// User Design Colors
				"primary-neon": "#00f2ff", // Neon Cyan
				"secondary-neon": "#bd00ff", // Neon Purple
				"background-dark": "#050b14", // Deep dark blue/black
				"card-dark": "#0f1c2e", // Slightly lighter dark blue for cards
				"card-darker": "#0a1320",
				"accent-purple": "#d946ef",

				// Legacy pastel aliases (mapped to dark theme)
				'pastel-bg': '#0A0F1A',
				'pastel-card': '#1E293B',
				'pastel-text': '#F8FAFC',
				'pastel-blue': 'rgba(34, 211, 238, 0.2)',
				'pastel-blue-dark': '#22D3EE',
				'pastel-pink': 'rgba(251, 113, 133, 0.2)',
				'pastel-pink-dark': '#FB7185',
				'pastel-green': 'rgba(52, 211, 153, 0.2)',
				'pastel-green-dark': '#34D399',
				'pastel-lavender': 'rgba(167, 139, 250, 0.2)',
				'pastel-peach': 'rgba(251, 146, 60, 0.2)',

				// System colors
				'primary': '#22D3EE',
				'primary-light': '#67E8F9',
				'primary-pale': 'rgba(34, 211, 238, 0.15)',
				'surface': '#1E293B',
				'text-main': '#F8FAFC',
				'text-subtle': '#94A3B8',

				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontFamily: {
				display: [
					'Quicksand'
				],
				body: [
					'Nunito'
				],
				'display-bold': [
					'Quicksand-Bold'
				],
				'body-bold': [
					'Nunito-Bold'
				]
			},
			borderRadius: {
				xl: '1.5rem',
				'2xl': '2rem',
				'3xl': '2.5rem',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				soft: '0 4px 20px -4px rgba(0,0,0,0.4)',
				glow: '0 0 30px rgba(34, 211, 238, 0.4)',
				'glow-violet': '0 0 30px rgba(167, 139, 250, 0.4)',
				'glow-emerald': '0 0 30px rgba(52, 211, 153, 0.4)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};
