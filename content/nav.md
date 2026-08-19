---
title: Navigation
---

<style>
.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.nav-card {
  background: var(--lightgray);
  border-radius: 12px;
  padding: 1.5rem;
  border-left: 4px solid var(--primary);
  transition: transform 0.2s, box-shadow 0.2s;
}

.nav-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.nav-card h2 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--dark);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-card h2::before {
  font-size: 1.4rem;
}

.nav-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-card li {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--lightgray);
}

.nav-card li:last-child {
  border-bottom: none;
}

.nav-card a {
  color: var(--dark);
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: color 0.2s;
}

.nav-card a:hover {
  color: var(--secondary);
}

.nav-card .meta {
  font-size: 0.8rem;
  color: var(--gray);
}

.nav-card .tag {
  display: inline-block;
  background: var(--secondary);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  margin-left: 0.5rem;
}

.recent-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recent-item {
  padding: 0.85rem 0;
  border-bottom: 1px solid color-mix(in srgb, var(--gray) 25%, transparent);
}

.recent-item:last-child {
  border-bottom: none;
}

.recent-link {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  text-decoration: none;
  color: var(--dark);
}

.recent-link:hover .recent-title {
  color: var(--secondary);
}

.recent-main {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
}

.recent-title {
  font-weight: 600;
  line-height: 1.4;
  transition: color 0.2s;
}

.recent-tag {
  display: inline-block;
  background: var(--secondary);
  color: white;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  font-size: 0.72rem;
  white-space: nowrap;
}

.recent-meta {
  font-size: 0.78rem;
  color: var(--gray);
  white-space: nowrap;
}

.recent-desc {
  margin: 0.35rem 0 0;
  font-size: 0.82rem;
  line-height: 1.45;
  color: var(--darkgray);
}

.recent-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.recent-primary,
.recent-secondary {
  display: inline-flex;
  align-items: center;
  padding: 0.55rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.88rem;
  transition: opacity 0.2s, transform 0.2s;
}

.recent-primary {
  background: var(--secondary);
  color: white;
}

.recent-secondary {
  background: transparent;
  color: var(--secondary);
  border: 1px solid color-mix(in srgb, var(--secondary) 35%, transparent);
}

.recent-primary:hover,
.recent-secondary:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

.recent-empty {
  color: var(--darkgray);
  font-size: 0.92rem;
  line-height: 1.6;
}

.nav-card-wide {
  grid-column: 1 / -1;
}

@media (min-width: 900px) {
  .nav-card-wide {
    grid-column: span 2;
  }
}

.search-box {
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.search-box input {
  width: 100%;
  padding: 0.8rem 1.2rem;
  border: 2px solid var(--lightgray);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--light);
  color: var(--dark);
}

.search-box input:focus {
  outline: none;
  border-color: var(--secondary);
}

.view-all {
  text-align: center;
  margin-top: 1rem;
}

.view-all a {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: var(--secondary);
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: opacity 0.2s;
}

.view-all a:hover {
  opacity: 0.9;
}

.hero-nav {
  text-align: center;
  padding: 3rem 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.hero-nav h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--dark);
}

.hero-nav p {
  color: var(--darkgray);
  font-size: 1rem;
}
</style>

<div class="hero-nav">
  <h1>🔍 Navigation</h1>
  <p>Explore my digital garden: recent updates, popular content, and topic collections</p>
</div>

<div class="search-box">
  <input type="text" placeholder="Search notes... (Press / to focus)" id="search-input">
</div>

<div class="nav-grid">
  <!-- 最近更新：由 scripts/inject-nav-recent.mjs 在 CI 构建前注入 -->
  <div class="nav-card nav-card-wide" style="border-left-color: var(--secondary);">
    <h2>📝 最近更新</h2>
    <p class="meta" style="margin: -0.5rem 0 1rem;">按修改时间排序，方便直接跳转到最新笔记</p>
    <!-- RECENT_NOTES_START -->
    <div class="recent-empty">部署后会自动显示各内容库的最新笔记。</div>
    <!-- RECENT_NOTES_END -->
  </div>

  <!-- Popular Tags -->
  <div class="nav-card" style="border-left-color: var(--tertiary);">
    <h2>🏷️ Popular Topics</h2>
    <ul>
      <li><a href="./tags/computer-graphics">Computer Graphics <span class="tag">CG</span></a></li>
      <li><a href="./tags/mesh-processing">Mesh Processing</a></li>
      <li><a href="./tags/geometric-computing">Geometric Computing</a></li>
      <li><a href="./tags/curves-surfaces">Curves & Surfaces</a></li>
      <li><a href="./tags/recommendation-systems">Recommendation Systems</a></li>
    </ul>
    <div class="view-all">
      <a href="./tags">All Tags</a>
    </div>
  </div>

  <!-- Content Libraries -->
  <div class="nav-card" style="border-left-color: var(--primary);">
    <h2>📚 Knowledge Libraries</h2>
    <ul>
      <li>
        <a href="./cg/">
          <span>Computer Graphics</span>
          <span class="meta">Geometric Modeling</span>
        </a>
      </li>
      <li>
        <a href="./cg/曲面曲线/">
          <span>Curves & Surfaces</span>
          <span class="meta">Bezier, B-Spline, NURBS</span>
        </a>
      </li>
      <li>
        <a href="./tg/">
          <span>TG</span>
          <span class="meta">ExactWit/TG</span>
        </a>
      </li>
    </ul>
  </div>

  <!-- Quick Links -->
  <div class="nav-card" style="border-left-color: rgb(236, 72, 153);">
    <h2>🔗 Quick Links</h2>
    <ul>
      <li><a href="./index">👤 About Me</a></li>
      <li><a href="https://github.com/ExactWit" target="_blank">💻 GitHub Profile</a></li>
      <li><a href="https://orcid.org/0009-0007-2207-7710" target="_blank">📄 ORCID Profile</a></li>
      <li><a href="mailto:chillypepper@foxmail.com">✉️ Contact Email</a></li>
    </ul>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');

  document.addEventListener('keydown', function(e) {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });
});
</script>

---

<div style="text-align: center; margin-top: 3rem; padding: 2rem; color: var(--gray); font-size: 0.9rem;">
  <p>💡 <strong>Tip:</strong> Use the search box or press <kbd>/</kbd> to quickly find content</p>
  <p style="margin-top: 0.5rem;">Last updated: <span id="last-updated"></span></p>
</div>

<script>
document.getElementById('last-updated').textContent = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
</script>
