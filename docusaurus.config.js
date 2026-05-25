// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import { themes as prismThemes } from 'prism-react-renderer';
import math from 'remark-math';
import katex from 'rehype-katex';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: '人机同频：与 AI 并肩的编程修行路',
  tagline: '在沸腾的算力中，守住编码的初心。从大模型心法、提示词工程到 Agent 自动化与项目级重构的硬核人机协作指南。',
  url: 'https://cocode.qizhen.xyz',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  projectName: 'cocode', // Usually your repo name.
  i18n: {
    defaultLocale: 'zh-cn',
    locales: ['zh-cn'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          sidebarCollapsed: false,
          // Please change this to your repo.
          editUrl: 'https://github.com/ruanqizhen/cocode/edit/main/',
          routeBasePath: '/',
          path: './docs',
          remarkPlugins: [math],
          rehypePlugins: [katex],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
        gtag: {
          trackingID: 'G-9EFRGQK2N0',
        },
      }),
    ],
  ],

  themeConfig: (
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      image: 'img/logo.png',
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        hideOnScroll: true,
        title: '人机同频：与 AI 并肩的编程修行路',
        logo: {
          alt: '人机同频',
          src: 'img/logo.png',
          href: '/'
        },
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      zoomSelector: '.markdown img',
      metadata: [
        { name: 'keywords', content: '人机同频, AI 编程, Cursor, Windsurf, Claude Code, Aider, Copilot, 提示词工程, 上下文工程, Agent 自动化, MCP 协议, 软件重构, 编程修行' },
        { name: 'description', content: '《人机同频：与 AI 并肩的编程修行路》是一本关于大模型时代下“人机协同”编程的硬核修行指南。涵盖提示词工程、上下文管理、Agent 自动化及软件生命周期智能化升级等。' },
        { name: 'author', content: 'Qizhen Ruan 阮奇桢' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'og:title', content: '人机同频：与 AI 并肩的编程修行路 - 你的 AI 时代编程修行宝典' },
        { name: 'og:description', content: '大模型时代下的硬核编程修行指南，教你如何用严谨的领域建模与优雅的架构设计框定 AI，真正实现“人机同频”的工程共振。' },
      ],
    }
  ),
  plugins: [
    function analyticsPlugin(context, options) {
      return {
        name: 'analytics-plugin',
        injectHtmlTags({ content }) {
          return {
            postBodyTags: [`
               <script async type="text/javascript" src="https://hm.baidu.com/hm.js?b3f6e7ec9302021671173e3fad14f4cd"></script>
               <script async type="text/javascript">
                 (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                  })(window, document, "clarity", "script", "jxmn1qjx88");
               </script>
            `],
          };
        },
      };
    },
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        language: ["en", "zh"],
        docsRouteBasePath: "/",
        highlightSearchTermsOnTargetPage: true,
      },
    ],
    "./src/plugin/plugin-image-zoom",
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-zh0CIslj+VczCZtlzBcjt5ppRcsAmDnRem7ESsYwWwg3m/OaJ2l4x7YBZl9Kxxib',
      crossorigin: 'anonymous',
    },
  ],
};

export default config;

