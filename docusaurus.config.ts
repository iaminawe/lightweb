import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Kootenay Lightweb',
  tagline: 'Sovereign tech for the awakening mind',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://iaminawe.github.io',
  baseUrl: '/lightweb/',

  organizationName: 'iaminawe',
  projectName: 'lightweb',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Kootenay Lightweb',
      logo: {
        alt: 'Kootenay Lightweb',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Lightweb',
          items: [
            {
              label: 'lightweb.koots.net',
              href: 'https://lightweb.koots.net',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Kootenay Lightweb Community Services Cooperative.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
