
// import path from 'path'
//
// module.exports = {
//     alias: {
//         '/@/': path.resolve(__dirname, 'src'),
//     },
//     hostname: '127.0.0.1', // 默认是 localhost
//     port: '4203', // 默认是 3000 端口
//     open: true, // 浏览器自动打开
//     https: false, // 是否开启 https
//     ssr: false, // 服务端渲染
//     base: './', // 生产环境下的公共路径
//     outDir: 'dist', // 打包构建输出路径，默认 dist ，如果路径存在，构建之前会被删除
//     proxy: { // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
//         '/api/v1': {
//             target: 'http://172.16.78.42:8002', // 后端服务实际地址
//             changeOrigin: true,
//             // rewrite: path => path.replace(/^\/api/, '')
//         },
//         '/devops-toolbox/api/v1': {
//             target: 'http://172.16.78.42:8002', // 后端服务实际地址
//             changeOrigin: true,
//         }
//     }
// }

export default {
    server: {
        hostname: '127.0.0.1',
        port: '4203',
        open: true,
        https: false,
        ssr: false,
        base: './',
        outDir: 'dist',
        proxy: {
            '/api/v1': {
                target: 'http://172.16.78.42:8002', // 后端服务实际地址
                changeOrigin: true,
            },
            '/devops-toolbox/api/v1': {
                target: 'http://172.16.78.42:8002', // 后端服务实际地址
                changeOrigin: true,
            },
        }
    }
}
