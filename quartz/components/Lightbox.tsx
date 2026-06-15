import { QuartzComponent, QuartzComponentConstructor } from "./types"
import lightboxScript from "./scripts/lightbox.inline"

export default (() => {
  const Lightbox: QuartzComponent = () => {
    // 这个组件不渲染任何可见内容
    // 脚本通过 afterDOMLoaded 自动加载
    return null
  }

  Lightbox.afterDOMLoaded = lightboxScript

  return Lightbox
}) satisfies QuartzComponentConstructor
