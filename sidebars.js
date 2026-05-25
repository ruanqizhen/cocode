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
      label: 'AI 编程基础',
      collapsed: false,
      items: [
        'mindset',
        'prompt',
        'tools',
        'planning',
        'context',
        'iteration',
      ],
    },
    {
      type: 'category',
      label: '项目级配置与 Agent 自动化',
      collapsed: false,
      items: [
        'instructions',
        'agent_mcp',
        'refactoring',
        'debugging',
        'quality_docs',
        'critical_thinking',
        'growth',
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
