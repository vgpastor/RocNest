// eslint.config.mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import unusedImports from "eslint-plugin-unused-imports";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier/flat"; // opcional, pero recomendado

export default defineConfig([
    // 1) Reglas oficiales de Next (Core Web Vitals)
    ...nextVitals,

    // 2) Reglas TS de Next (typescript-eslint)
    ...nextTs,

    // 3) Tus mejoras de “auto-fix” y orden de imports
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        plugins: {
            "unused-imports": unusedImports,
            import: importPlugin,
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            // --- UNUSED IMPORTS: elimina la línea completa con --fix
            "unused-imports/no-unused-imports": "error",

            // --- UNUSED VARS: permite prefijo "_" para silenciar avisos
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "unused-imports/no-unused-vars": [
                "warn",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "^_",
                },
            ],

            // --- ORDEN DE IMPORTS: alfabético + grupos y salto entre grupos
            "import/order": [
                "warn",
                {
                    alphabetize: { order: "asc", caseInsensitive: true },
                    groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
                    "newlines-between": "always",
                    // Si usas types en imports y quieres separarlos:
                    // "newlines-between-types": "always"
                },
            ],
        },
        settings: {
            // Ayuda a resolver paths/tsconfig paths (si usas alias)
            "import/resolver": {
                typescript: true,
                node: true,
            },
        },
    },

    // 4) Prettier al final para neutralizar reglas de estilo que chocan
    prettier,

    // 5) Mantener los ignores por defecto de Next (y añadir los tuyos si quieres)
    globalIgnores([
        // Ignores que Next documenta
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
        // Añade lo que quieras ignorar globalmente:
        // "coverage/**",
        // "dist/**",
    ]),
]);
