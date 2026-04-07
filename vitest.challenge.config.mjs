import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['coding-challenge/rewards/**/*.vitest.spec.js'],
    environment: 'node',
    coverage: {
      enabled: false
    }
  }
});
