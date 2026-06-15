// Lightbox 图片查看器 - 内联脚本
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

  const overlay = lightbox.querySelector(".lightbox-overlay")
  const container = lightbox.querySelector(".lightbox-container")
  const img = lightbox.querySelector(".lightbox-image")
  const closeBtn = lightbox.querySelector(".lightbox-close")
  const prevBtn = lightbox.querySelector(".lightbox-prev")
  const nextBtn = lightbox.querySelector(".lightbox-next")
  const counter = lightbox.querySelector(".lightbox-counter")

  // 获取所有文章中的图片
  const getImages = () => {
    return Array.from(document.querySelectorAll("article img, .page-content img, .center img, .popover img"))
      .filter(img => !img.closest(".lightbox"))
  }

  let currentImages = []
  let currentIndex = 0
  let scale = 1

  const openLightbox = (index) => {
    currentImages = getImages()
    currentIndex = index
    scale = 1
    img.style.transform = "scale(1)"
    updateImage()
    lightbox.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    lightbox.classList.remove("active")
    document.body.style.overflow = ""
    img.src = ""
    scale = 1
    img.style.transform = "scale(1)"
  }

  const updateImage = () => {
    if (currentImages.length === 0) return
    
    const currentImg = currentImages[currentIndex]
    img.src = currentImg.src
    img.alt = currentImg.alt || ""
    
    counter.textContent = `${currentIndex + 1} / ${currentImages.length}`
    
    prevBtn.style.display = currentImages.length > 1 ? "block" : "none"
    nextBtn.style.display = currentImages.length > 1 ? "block" : "none"
  }

  const nextImage = () => {
    if (currentImages.length <= 1) return
    currentIndex = (currentIndex + 1) % currentImages.length
    scale = 1
    img.style.transform = "scale(1)"
    updateImage()
  }

  const prevImage = () => {
    if (currentImages.length <= 1) return
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length
    scale = 1
    img.style.transform = "scale(1)"
    updateImage()
  }

  // 为所有图片添加点击事件
  const initImageClickHandlers = () => {
    const images = getImages()
    images.forEach((image, index) => {
      if (image.dataset.lightboxInitialized) return
      
      image.style.cursor = "zoom-in"
      image.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        openLightbox(index)
      })
      
      image.dataset.lightboxInitialized = "true"
    })
  }

  // 初始化和监听 DOM 变化
  initImageClickHandlers()
  
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

  // 滚轮缩放
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
