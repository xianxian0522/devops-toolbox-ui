
import path from 'path'
import {UserConfig} from 'vite';

const viteConfig: UserConfig = {
    hostname: '127.0.0.1',
    port: 7003,
    open: true,
    https: false,
    ssr: false,
    // base: './',
    outDir: 'dist',
    alias: {
        '/@/': path.resolve(__dirname, 'src'),
    },
    proxy: {
        '/api/v1': {
            // target: 'http://devops-toolbox.dev.ops.sumscope.com:7003',
            target: 'http://172.16.97.194:7003',
            changeOrigin: true,
        },
        '/devops-toolbox/api/v1': {
            target: 'http://172.16.97.194:7003',
            // target: 'http://172.16.69.122:8001',
            changeOrigin: true,
        },
        '/job-actuator/api/v1': {
            // target: 'http://devops-toolbox.dev.ops.sumscope.com:7003',
            target: 'http://172.16.97.194:7003',
            changeOrigin: true,
        },
        '/api/my/': {
            target: 'http://172.16.97.194:3000',
            changeOrigin: true,
        }
    },
};

export default viteConfig
