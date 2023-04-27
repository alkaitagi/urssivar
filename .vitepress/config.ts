import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'
import path from 'path';

const telegramSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="currentColor" d="M19.777 4.43a1.5 1.5 0 0 1 2.062 1.626l-2.268 13.757c-.22 1.327-1.676 2.088-2.893 1.427c-1.018-.553-2.53-1.405-3.89-2.294c-.68-.445-2.763-1.87-2.507-2.884c.22-.867 3.72-4.125 5.72-6.062c.785-.761.427-1.2-.5-.5c-2.303 1.738-5.998 4.381-7.22 5.125c-1.078.656-1.64.768-2.312.656c-1.226-.204-2.363-.52-3.291-.905c-1.254-.52-1.193-2.244-.001-2.746l17.1-7.2Z"/></g></svg>'

// https://vitepress.dev/reference/site-config
export default withPwa(defineConfig({
  pwa: {},
  vite: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "../components") // map '@' to './src' 
      },
    },
  },
  base: '/urssivar/',

  title: "Urssivar",
  description: "Kaitag Language Standard",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Examples', link: '/examples' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Markdown Examples', link: '/guide/introduction' },
          { text: 'Runtime API Examples', link: '/guide/api-examples' }
        ]
      },
      {
        text: 'Essentials',
        items: [
          { text: 'Markdown Examples', link: '/guide/ess3' },
          { text: 'Runtime API Examples', link: '/guide/ess4' }
        ]
      },
      {
        text: 'Essentials',
        items: [
          { text: 'Markdown Examples', link: '/guide/ess1' },
          { text: 'Runtime API Examples', link: '/guide/ess2' }
        ]
      },
    ],

    socialLinks: [
      {
        icon: { svg: telegramSvg },
        link: 'https://t.me/urssivar'
      },
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
}));
