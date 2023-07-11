import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import VitePluginCompression from 'vite-plugin-compression';
import path from 'path';

export default defineConfig(({ mode }) => {
  return {
    // 和 webpack 中 的 publicPath 一样
    // 公共基础路径
    base: mode === 'development' ? '/' : '/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [
      react(),
      checker({
        typescript: true, // 当typescript语法错误时浏览器给出错误提示弹窗,强制开发者修改ts错误
      }),
      VitePluginCompression({
        verbose: true, //是否在控制台输出压缩结果
        disable: false, //是否禁用,相当于开关在这里
        threshold: 10240, //体积大于 threshold 才会被压缩,单位 b，1b=8B, 1B=1024KB
        algorithm: 'gzip', //压缩算法,可选 [ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
        ext: '.gz', //文件后缀
      }), // gzip 压缩
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            '@primary-color': '#2d8cf0',
          },
        },
      },
    },
    // 构建选项
    // https://zhuanlan.zhihu.com/p/594203360
    build: {
      target: 'es2015',
      outDir: path.resolve(__dirname, 'dist'),
      assetsDir: 'static',
      assetsInlineLimit: 8192,
      sourcemap: false,
      reportCompressedSize: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, //剔除console,和debugger
          drop_debugger: true,
        },
      },
      rollupOptions: {
        // vite打包是通过rollup来打包的
        output: {
          entryFileNames: '[name].js', // 指定 入口文件输出后的存放位置
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]', // 指定 静态资源输出后的存放位置
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
          // 指定 chunks输出后的存放位置
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
            const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';
            return `js/${fileName}/[name].[hash].js`;
          },
        },
      },
    },

    server: {
      https: false, // 当前项目是否选用Https的服务,详情请查看vite官网
      host: '0.0.0.0', // 可以外部访问(局域网访问)

      port: 9097,
      proxy: {
        // '/edu': {
        //   target: 'http://59.110.167.130',
        //   secure: false,
        //   changeOrigin: true,
        // },
      },
    },
    define: {
      'process.env': loadEnv(mode, './', 'VITE_'),
    },
    envDir: './', // 用于加载 .env 文件的目录。
    envPrefix: 'VITE_', // 以 envPrefix 开头的环境变量会通过 import.meta.env 暴露在你的客户端源码中。
  };
});
