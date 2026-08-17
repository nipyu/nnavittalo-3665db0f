import { build } from "vite";

async function generateStatic() {
  await build({
    mode: "production",
    build: {
      outDir: ".output/public",
      ssr: false,
    },
  });
}
generateStatic();
