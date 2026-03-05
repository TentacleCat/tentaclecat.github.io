import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration — TentacleCat Blog
 *
 * Security Model (Defense in Depth):
 *   Layer 1: publish.sh — only copies files with `publish: true` to content/
 *   Layer 2: ignorePatterns — blocks sensitive folder patterns at build time
 *   Layer 3: ExplicitPublish — Quartz only renders files with `publish: true`
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "TentacleCat",
    pageTitleSuffix: " | Blog",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "zh-CN",
    baseUrl: "tentaclecat.github.io",
    // Layer 2: Folder-level blocklist (even if files leak past Layer 1)
    ignorePatterns: [
      "private",
      "templates",
      ".obsidian",
      "**/Daily/**",
      "**/Food/**",
      "**/Job/**",
      "**/Make Money*/**",
      "**/Personal Home/**",
      "**/tmp_data/**",
      "**/LeetCode/**",
    ],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Noto Sans SC",
        body: "Noto Sans SC",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f8",
          lightgray: "#e5e5e5",
          gray: "#b8b8b8",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          secondary: "#284b63",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#161618",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#7b97aa",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.SlugOverride(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    // Layer 3: ExplicitPublish — only notes with `publish: true` are rendered
    filters: [Plugin.ExplicitPublish()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
