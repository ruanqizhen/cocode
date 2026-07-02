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
      ],
    },
    {
      type: 'category',
      label: '工具与实战篇：个人敏捷开发',
      collapsed: false,
      items: [
        'api',
        'ai_agent',
        'tools',
        'cc',
        'context',
        'planning',
        'make_ebook',
        'iteration',
        'refactoring',
        'testing',
        'debugging',
      ],
    },
    {
      type: 'category',
      label: '高阶架构篇：从单兵到自动化系统',
      collapsed: false,
      items: [
        'multimodal',
        'rules',
        'skills',
        'mcp',
        'subagent',
        'code_review',
        'critical_thinking',
        'team_collaboration',
        'cost_control',
        'harness',
        'loop',
      ],
    },
    {
      type: 'category',
      label: '趣味篇：AI 的奇妙行为学',
      collapsed: false,
      items: [
        'bloopers',
        'sycophancy',
        'hallucination',
        'laziness',
        'jailbreak',
        'mountain',
        'growth',
      ],
    },
    {
      type: 'category',
      label: '附录',
      collapsed: true,
      items: [
        'markdown',
        'ai_agent_prompt',
        'ai_agent_code',
        'nodejs',
      ],
    },
    {
      type: 'doc',
      label: '注意力是你所需要的一切',
      id: 'attention',
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
