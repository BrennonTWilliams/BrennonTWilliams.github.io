import js from "@eslint/js";
import eslintPluginAstro from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser';
import tseslint from 'typescript-eslint';
import globals from "globals";

export default tseslint.config(
  // Global ignores
  {
    ignores: ["dist/", ".astro/", "node_modules/", "**/*.css"],
  },

  // ESLint recommended rules (base)
  js.configs.recommended,

  // TypeScript configuration (for .ts files, excluding .d.ts)
  {
    files: ["**/*.ts"],
    ignores: ["**/*.d.ts"], // Exclude .d.ts from this block
    extends: [
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node
      }
    },
    rules: {
      'no-unused-vars': 'warn'
    }
  },

  // Astro specific configuration
  {
    files: ["**/*.astro"],
    plugins: {
      astro: eslintPluginAstro
    },
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".astro"],
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
      }
    },
    rules: {
      ...(eslintPluginAstro.configs.recommended.rules),
      'no-undef': 'off'
    }
  },

  // Configuration for script blocks within Astro files
  {
     files: ["**/*.astro/*.js", "**/*.astro/*.ts"],
     extends: [
       ...tseslint.configs.recommended,
     ],
     languageOptions: {
       globals: {
         ...globals.browser
       }
     },
     rules: {
       'no-unused-vars': 'warn',
       '@typescript-eslint/no-unused-vars': 'warn'
     }
  },

  // Configuration specifically for .d.ts files
  {
    files: ["**/*.d.ts"],
    rules: {
      // Disable the triple-slash reference rule for declaration files
      "@typescript-eslint/triple-slash-reference": "off"
    }
  }
);
