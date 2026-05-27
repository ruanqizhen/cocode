// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      label: '前言',
      id: 'README',
    },
    'background',
    'nocode',
    'nocode_iteration',
    'mindset',
    'prompt',
    'tools',
    'planning',
    'context',
    'iteration',
    'instructions',
    'agent_mcp',
    'refactoring',
    'debugging',
    'quality_docs',
    'critical_thinking',
    'growth',
    'appendix_a',
    'appendix_b',
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
