document.addEventListener("DOMContentLoaded", () => {
  // 创建 lightbox 容器
  const lightbox = document.createElement("div")
  lightbox.className = "lightbox"
  lightbox.innerHTML = `
    <div class="lightbox-overlay"></div>
    <div class="lightbox-container">
      <img class="lightbox-image" src="" alt="">
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-prev" aria-label="Previous">&#10094;</button>
      <button class="lightbox-next" aria-label="Next">&#10095;</button>
      <div class="lightbox-counter"></div>
    </div>
  `
  document.body.appendChild(lightbox)

  const overlay = lightbox.querySelector(".lightbox-overlay") as HTMLElement
  const container = lightbox.querySelector(".lightbox-container") as HTMLElement
  const img = lightbox.querySelector(".lightbox-image") as HTMLImageElement
  const closeBtn = lightbox.querySelector(".lightbox-close") as HTMLElement
  const prevBtn = lightbox.querySelector(".lightbox-prev") as HTMLElement
  const nextBtn = lightbox.querySelector(".lightbox-next") as HTMLElement
  const counter = lightbox.querySelector(".lightbox-counter") as HTMLElement

  // 获取所有文章中的图片（排除已在小图模式中的图片）
  const getImages = () => {
    return Array.from(document.querySelectorAll("article img, .page-content img, .center img"))
      .filter(img => !img.closest(".lightbox")) as HTMLImageElement[]
  }

  let currentImages: HTMLImageElement[] = []
  let currentIndex = 0

  const openLightbox = (index: number) => {
    currentImages = getImages()
    currentIndex = index
    updateImage()
    lightbox.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    lightbox.classList.remove("active")
    document.body.style.overflow = ""
    img.src = ""
  }

  const updateImage = () => {
    if (currentImages.length === 0) return
    
    const currentImg = currentImages[currentIndex]
    img.src = currentImg.src
    img.alt = currentImg.alt || ""
    
    // 更新计数器
    counter.textContent = `${currentIndex + 1} / ${currentImages.length}`
    
    // 更新按钮显示状态
    prevBtn.style.display = currentImages.length > 1 ? "block" : "none"
    nextBtn.style.display = currentImages.length > 1 ? "block" : "none"
  }

  const nextImage = () => {
    if (currentImages.length <= 1) return
    currentIndex = (currentIndex + 1) % currentImages.length
    updateImage()
  }

  const prevImage = () => {
    if (currentImages.length <= 1) return
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length
    updateImage()
  }

  // 为所有图片添加点击事件
  const initImageClickHandlers = () => {
    const images = getImages()
    images.forEach((image, index) => {
      // 排除已经设置过的图片
      if (image.dataset.lightboxInitialized) return
      
      image.style.cursor = "zoom-in"
      image.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        openLightbox(index)
      })
      
      // 标记为已初始化
      image.dataset.lightboxInitialized = "true"
    })
  }

  // 初始化和监听 DOM 变化（处理 SPA 导航）
  initImageClickHandlers()
  
  // 使用 MutationObserver 监听新添加的图片（SPA 导航后）
  const observer = new MutationObserver(() => {
    initImageClickHandlers()
  })
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })

  // 事件监听
  closeBtn.addEventListener("click", closeLightbox)
  overlay.addEventListener("click", closeLightbox)
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    nextImage()
  })
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    prevImage()
  })

  // 键盘导航
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return
    
    switch (e.key) {
      case "Escape":
        closeLightbox()
        break
      case "ArrowRight":
        nextImage()
        break
      case "ArrowLeft":
        prevImage()
        break
    }
  })

  // 触摸滑动支持
  let touchStartX = 0
  let touchEndX = 0

  container.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX
  }, { passive: true })

  container.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX
    handleSwipe()
  }, { passive: true })

  const handleSwipe = () => {
    const swipeThreshold = 50
    const diff = touchStartX - touchEndX
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextImage()
      } else {
        prevImage()
      }
    }
  }

  // 鼠标滚轮缩放（可选功能）
  let scale = 1
  container.addEventListener("wheel", (e) => {
    if (!lightbox.classList.contains("active")) return
    e.preventDefault()
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    scale = Math.max(0.5, Math.min(3, scale + delta))
    img.style.transform = `scale(${scale})`
  }, { passive: false })

  // 双击重置缩放
  container.addEventListener("dblclick", () => {
    scale = 1
    img.style.transform = `scale(${scale})`
  })
})
