// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      label: '前言',
      id: 'README',
    },
    {
      type: 'category',
      label: '🧭 筑基篇：重塑认知与挑选“赛博配剑”',
      collapsed: false,
      items: [
        'ch01_mindset',
        'ch02_prompt',
        'ch03_tools',
      ],
    },
    {
      type: 'category',
      label: '🛠️ 方法篇：人机同频的黄金工作流',
      collapsed: false,
      items: [
        'ch04_planning',
        'ch05_context',
        'ch06_iteration',
      ],
    },
    {
      type: 'category',
      label: '🚀 进阶篇：项目级配置与 Agent 自动化',
      collapsed: false,
      items: [
        'ch07_instructions',
        'ch08_agent_mcp',
      ],
    },
    {
      type: 'category',
      label: '🏗️ 实战篇：软件全生命周期的智能化演进',
      collapsed: false,
      items: [
        'ch09_refactoring',
        'ch10_debugging',
        'ch11_quality_docs',
      ],
    },
    {
      type: 'category',
      label: '☯️ 心智篇：匠人精神的坚守与自我成长',
      collapsed: false,
      items: [
        'ch12_critical_thinking',
        'ch13_growth',
      ],
    },
    {
      type: 'category',
      label: '附录',
      collapsed: true,
      items: [
        'appendix_a',
        'appendix_b',
      ],
    },
    {
      type: 'link',
      label: 'GitHub 仓库',
      href: 'https://github.com/ruanqizhen/cocode',
    },
    {
      type: 'link',
      label: '作者个人主页',
      href: 'https://qizhen.xyz',
    },
  ],
};

module.exports = sidebars;
