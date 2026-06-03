import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { formatDate } from "../util/date"
import { i18n } from "../i18n"

function DateFooter({ fileData, cfg }: QuartzComponentProps) {
  // Get dates from frontmatter or git
  const created = fileData.frontmatter?.date
  const modified = fileData.frontmatter?.lastmod
  
  // If no dates in frontmatter, show nothing (created-modified-date plugin handles this)
  // This component supplements the existing content-meta display
  
  if (!created && !modified) {
    return null
  }

  const createdStr = created ? formatDate(created as string, cfg.locale) : null
  const modifiedStr = modified ? formatDate(modified as string, cfg.locale) : null

  return (
    <div className="date-footer">
      <div className="date-footer-content">
        {createdStr && (
          <span className="date-item">
            <span className="date-icon">📅</span>
            <span className="date-label">{i18n(cfg.locale).components.contentMeta.created}:</span>
            <span className="date-value">{createdStr}</span>
          </span>
        )}
        {modifiedStr && (
          <span className="date-item">
            <span className="date-icon">📝</span>
            <span className="date-label">{i18n(cfg.locale).components.contentMeta.modified}:</span>
            <span className="date-value">{modifiedStr}</span>
          </span>
        )}
      </div>
    </div>
  )
}

export default (() => DateFooter) satisfies QuartzComponentConstructor
