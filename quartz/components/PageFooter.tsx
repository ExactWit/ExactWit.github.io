import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { formatDate } from "../util/date"

function PageFooter({ fileData }: QuartzComponentProps) {
  // Get dates from frontmatter or git
  const created = fileData.frontmatter?.date 
    ? formatDate(fileData.frontmatter.date as string)
    : null
  
  const modified = fileData.frontmatter?.lastmod 
    ? formatDate(fileData.frontmatter.lastmod as string)
    : null

  // If no dates available, don't render
  if (!created && !modified) {
    return null
  }

  return (
    <footer className="page-footer">
      {created && (
        <div className="meta-item">
          <span className="meta-label">📅 Created:</span>
          <span>{created}</span>
        </div>
      )}
      {modified && (
        <div className="meta-item">
          <span className="meta-label">📝 Last Updated:</span>
          <span>{modified}</span>
        </div>
      )}
    </footer>
  )
}

export default (() => PageFooter) satisfies QuartzComponentConstructor
