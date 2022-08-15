import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'

import pkg from './package.json'
const name = 'ez'

const banner = `/*!
    ${name}.js v${pkg.version}
    ${pkg.homepage}
    Released under the ${pkg.license} License.
    */`

export default [
    // browser-friendly UMD build
    {
        input: 'src/index.ts',
        output: [
            {
                name: name,
                file: pkg.browser,
                format: 'umd',
                banner,
                sourcemap: true,
                plugins: [terser()],
            },
            {
                name: name,
                file: pkg.main,
                format: 'umd',
                banner,
                sourcemap: true,
            },
        ],
        // 開発用モジュールは含めない
        external: [...Object.keys(pkg.devDependencies || {})],
        plugins: [resolve(), typescript(), commonjs({ extensions: ['.ts', '.js'] })],
    },
    {
        input: 'src/index.ts',
        output: [
            {
                file: pkg.module,
                format: 'es',
                banner,
                sourcemap: true,
            },
        ],
        external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})],
        plugins: [
            resolve(),
            typescript({
                tsconfigOverride: {
                    compilerOptions: {
                        target: 'ES6',
                        removeComments: true,
                    },
                },
            }),
            commonjs({ extensions: ['.ts', '.js'] }),
        ],
    },
]
