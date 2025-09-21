import type { Config } from "tailwindcss";

export default {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'heading': ['Manrope', 'system-ui', 'sans-serif'],
        'ui': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Closebase Brand Colors
        'cb-primary': {
          DEFAULT: "hsl(var(--color-primary))",
          50: "hsl(var(--color-primary-50))",
          700: "hsl(var(--color-primary-700))",
        },
        'cb-accent': {
          DEFAULT: "hsl(var(--color-accent))",
          50: "hsl(var(--color-accent-50))",
        },
        'cb-success': "hsl(var(--color-success))",
        'cb-warning': "hsl(var(--color-warning))",
        'cb-danger': "hsl(var(--color-danger))",
        
        // Surfaces
        'cb-surface': "hsl(var(--surface))",
        'cb-surface-secondary': "hsl(var(--surface-secondary))",
        'cb-glass': "hsl(var(--glass))",
        
        // Legacy shadcn colors for compatibility
        primary: {
          DEFAULT: "hsl(var(--color-primary))",
          foreground: "hsl(0 0% 100%)",
        },
        secondary: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--color-danger))",
          foreground: "hsl(0 0% 100%)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--color-accent))",
          foreground: "hsl(0 0% 100%)",
        },
        popover: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)", 
        lg: "var(--radius-lg)",
      },
      boxShadow: {
        'glass': 'var(--shadow-glass)',
        'cb-sm': 'var(--shadow-sm)',
        'cb-md': 'var(--shadow-md)',
        'cb-lg': 'var(--shadow-lg)',
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-glass': 'var(--gradient-glass)',
        'gradient-hero': 'var(--gradient-hero)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'smooth': '160ms',
        'fast': '120ms',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
