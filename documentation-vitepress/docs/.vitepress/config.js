export default {
  title: 'B.A.G.E.L. Language',
  description: 'Board-based Automated Game Engine Language',
  base: '/docs/',
  ignoreDeadLinks: true,
  themeConfig: {
    nav: [{ text: 'Docs', link: '/' }],
    sidebar: [
      { text: 'Introduction', link: '/intro' },
      { text: 'Getting started', link: '/getting-started' },
      {
        text: 'Reference',
        items: [
          { text: 'Overview', link: '/reference/overview' },
          { text: 'Turn', link: '/reference/turn' },
          { text: 'Stages', link: '/reference/stages' },
          { text: 'Phases', link: '/reference/phases' },
          { text: 'Moves', link: '/reference/moves' },
          { text: 'Conditions', link: '/reference/conditions' },
          { text: 'Values and refs', link: '/reference/values-and-refs' },
          { text: 'Shorthand', link: '/reference/shorthand' },
        ],
      },
      {
        text: 'Examples',
        items: [
          { text: 'Tic-tac-toe', link: '/examples/tic-tac-toe' },
          { text: 'Connect Four', link: '/examples/connect-four' },
          { text: 'Reversi', link: '/examples/reversi' },
          { text: 'Checkers', link: '/examples/checkers' },
          { text: 'Eights', link: '/examples/eights' },
        ],
      },
    ],
  },
};
