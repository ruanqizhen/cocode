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
      label: '入门篇：零基础上手',
      collapsed: false,
      items: [
        'background',
        'nocode',
        'nocode_iteration',
        'git_basics',
        'github_pages',
        'mindset',
        'prompt',
        'context',
      ],
    },
    {
      type: 'category',
      label: '进阶篇：程序员的 AI 修行',
      collapsed: false,
      items: [
        'api',
        'env_setup',
        'planning',
        'make_ebook',
        'iteration',
        'multimodal',
        'cost_control',
        'tools',
        'instructions',
        'agent_mcp',
        'refactoring',
        'debugging',
        'quality_docs',
        'security',
        'critical_thinking',
        'team_collaboration',
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
