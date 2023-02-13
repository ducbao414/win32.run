import copy from 'rollup-plugin-copy-assets';
import { terser } from "rollup-plugin-terser";

export default {
    input: 'src/webworker/worker.js',
    output: [
        {
            file: 'dist/worker-bundle.js',
            format: 'iife'
        }
    ],
    plugins: [
        copy({
            assets: [
                './src/webworker/wasm-gen'
            ],
        }),
    ].concat( process.env.BUILD === 'production' ? [terser()] : [] ),
};