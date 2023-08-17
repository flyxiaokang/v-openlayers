import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

//unplugin-icons
import Icons from 'unplugin-icons/vite'
// 引入loader
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
// 引入icon自动引入解析器
import IconsResolver from 'unplugin-icons/resolver'
// 引入自动引入插件
import Components from 'unplugin-vue-components/vite'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), // 使用自动引入插件
    Components({
      // 配置解析器
      resolvers: [
        // Icon自动引入解析器
        IconsResolver({
          // 自动引入的Icon组件统一前缀，默认为 i，设置false为不需要前缀
          prefix: 'icon',
          // 当图标集名字过长时，可使用集合别名
          alias: {
            system: 'system-uicons',
          },
          // 标识自定义图标集
          customCollections: ['vc'],
          // enabledCollections:['ic']
        }),
      ],
      dts: true,
    }),
    Icons({
      // scale: 1.2, // Scale of icons against 1em
      // defaultStyle: '', // Style apply to icons
      // defaultClass: '', // Class names apply to icons
      compiler: 'vue3', // 'vue2', 'vue3', 'jsx'
      // 自动安装
      autoInstall: true,
      // 自定义图标加载
      customCollections: {
        // 给svg文件设置fill="currentColor"属性，使图标的颜色具有适应性
        vc: FileSystemIconLoader('src/VcMap/public/static/svg/vcMap', (svg) =>
          svg.replace(/^<svg /, '<svg fill="currentColor" ')
        ),
      },
    }),
    visualizer(),
  ],
  // new webpack.optimize.UglifyJsPlugin({
  //     compress: {
  //         warnings: false
  //     }
  // })],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  server: {
    port: '8207',
  },
})
