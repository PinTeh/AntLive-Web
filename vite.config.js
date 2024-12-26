import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
  Components({
    resolvers: [
      AntDesignVueResolver({
        importStyle: false, // css in js
      }),
    ],
  }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          colorPrimary: '#00b96b',
          borderRadiusBase: "0px",
        },
        javascriptEnabled: true,
      },
    },
  },
})
