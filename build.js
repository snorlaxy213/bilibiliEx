import esbuild from 'esbuild';
import fs from 'node:fs';

const banner = fs.readFileSync('src/meta.js', 'utf8');

await esbuild.build({
  entryPoints: ['src/main.js'],
  bundle: true,
  outfile: 'dist/biliex.user.js',
  format: 'iife',
  charset: 'utf8',
  target: 'es2020',
  banner: { js: banner },
});

console.log('build ok -> dist/biliex.user.js');
