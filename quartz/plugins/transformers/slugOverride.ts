import { QuartzTransformerPlugin } from "../types"
import { FullSlug, isFullSlug } from "../../util/path"

/**
 * SlugOverride: Override file.data.slug with frontmatter slug if present
 * 
 * This allows using `slug: my-custom-slug` in frontmatter to control the output URL path.
 * Must run AFTER FrontMatter transformer (which populates file.data.frontmatter.slug)
 */
export const SlugOverride: QuartzTransformerPlugin = () => {
  return {
    name: "SlugOverride",
    markdownPlugins(ctx) {
      return [
        () => {
          return (_, file) => {
            // Check if frontmatter has a slug defined
            const frontmatterSlug = file.data.frontmatter?.slug
            if (frontmatterSlug && typeof frontmatterSlug === "string") {
              // Validate it's a proper slug format
              const slugValue = frontmatterSlug.trim()
              if (slugValue.length > 0) {
                // Override the computed slug with the frontmatter slug
                file.data.slug = slugValue as FullSlug
                
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
