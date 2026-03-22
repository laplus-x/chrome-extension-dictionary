import { resolve } from "node:path";
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default defineConfig((env) =>
	mergeConfig(
		viteConfig(env),
		defineConfig({
			resolve: {
				alias: {
					"@": resolve(__dirname, "./src"), // Example alias mapping @ to ./src
				},
			},
			test: {
				environment: "web-ext",
				environmentOptions: {
					"web-ext": {
						path: "./dist",
					},
				},
			},
		}),
	),
);
