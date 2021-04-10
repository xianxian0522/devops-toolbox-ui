
import path from 'path'
import {UserConfig} from 'vite';

const viteConfig: UserConfig = {
    hostname: '127.0.0.1',
    port: 4203,
    open: true,
    https: false,
    ssr: false,
    base: './',
    outDir: 'dist',
    alias: {
        '/@/': path.resolve(__dirname, 'src'),
    },
    proxy: {
        '/api/v1': {
            target: 'https://172.16.78.42:8002',
            changeOrigin: true,
        },
        '/devops-toolbox/api/v1': {
            target: 'https://172.16.78.42:8002',
            changeOrigin: true,
        },
    },
}

export default viteConfig
