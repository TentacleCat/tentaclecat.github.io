import { QuartzTransformerPlugin } from "../types"
import { FullSlug, slugifyFilePath, FilePath } from "../../util/path"

/**
 * SlugOverride: Override file.data.slug with frontmatter slug if present
 *
 * This allows using `slug: my-custom-slug` in frontmatter to control the output URL path.
 * Must run AFTER FrontMatter transformer (which populates file.data.frontmatter.slug).
 *
 * When a slug override is applied:
 *   1. file.data.slug is changed to the frontmatter slug (controls HTML output path)
 *   2. The original file-path-based slug is added to file.data.aliases
 *      so that AliasRedirects creates a redirect page at the old path
 *   3. The new slug is added to ctx.allSlugs so wikilink resolution can find it
 */
export const SlugOverride: QuartzTransformerPlugin = () => {
  return {
    name: "SlugOverride",
    markdownPlugins(ctx) {
      return [
        () => {
          return (_, file) => {
            const frontmatterSlug = file.data.frontmatter?.slug
            if (frontmatterSlug && typeof frontmatterSlug === "string") {
              const slugValue = frontmatterSlug.trim()
              if (slugValue.length > 0) {
                // Save the original file-path-based slug before overriding
                const originalSlug = file.data.slug!

                // Override the computed slug with the frontmatter slug
                file.data.slug = slugValue as FullSlug

                // Add the original slug as an alias so AliasRedirects creates
                // a redirect page from the old path to the new clean URL
                const aliases = file.data.aliases ?? []
                aliases.push(originalSlug)
                file.data.aliases = aliases

                // Add the new slug to allSlugs so other transformers
                // (like CrawlLinks) can resolve links to it
                ctx.allSlugs.push(slugValue as FullSlug)

                if (ctx.cfg.configuration.verbose) {
                  console.log(
                    `[slug-override] ${file.data.filePath} -> ${file.data.slug} (from frontmatter)`
                  )
                }
              }
            }
          }
        },
      ]
    },
  }
}
