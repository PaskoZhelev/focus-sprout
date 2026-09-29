// Vite replaces import.meta.env.DEV with `false` in production, so the panel is dropped from the bundle.
export const DEBUG_ENABLED = import.meta.env.DEV
