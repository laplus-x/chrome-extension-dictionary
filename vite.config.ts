import { crx } from "@crxjs/vite-plugin";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { analyzer } from "vite-bundle-analyzer";
import checker from "vite-plugin-checker";
import inspect from "vite-plugin-inspect";
import zip from "vite-plugin-zip-pack";
import tsconfigPaths from "vite-tsconfig-paths";
import manifest from "./manifest.config.ts";
import { name, version } from "./package.json";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	return {
		plugins: [
			tsconfigPaths(),
			tailwindcss(),
			react(),
			babel({ presets: [reactCompilerPreset()] }),
			checker({
				biome: {
					command: "check",
				},
			}),
			crx({ manifest }),
			zip({ outDir: "release", outFileName: `${name}-${version}.zip` }),
			inspect({
				open: env.DEBUG === "true",
				build: env.NODE_ENV === "development",
				outputDir: ".inspect",
			}),
			analyzer({
				enabled: env.DEBUG === "true",
				openAnalyzer: env.NODE_ENV === "development",
				analyzerMode: "static",
				fileName: "report",
			}),
		],
		server: {
			cors: {
				origin: [/chrome-extension:\/\//],
			},
		},
		build: {
			sourcemap: true,
		},
	};
});
