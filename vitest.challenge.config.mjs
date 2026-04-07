import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.vitest.spec.js'],
    environment: 'node',
    coverage: {
      enabled: false
    }
  }
});
