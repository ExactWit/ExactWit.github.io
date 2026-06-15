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
  <!-- Recent Updates -->
  <div class="nav-card" style="border-left-color: var(--secondary);">
    <h2 style="--tw-prose-headings: var(--secondary);">📝 Recent Updates</h2>
    <ul id="recent-list">
      <li><em>Loading recent notes...</em></li>
    </ul>
    <div class="view-all">
      <a href="./tags/updates">View All Updates</a>
    </div>
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
// Navigation page functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const recentList = document.getElementById('recent-list');
  
  // Focus search on '/' key
  document.addEventListener('keydown', function(e) {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });
  
  // Fetch and display recent notes from content index
  async function loadRecentNotes() {
    try {
      // Use Quartz's pre-defined fetchData (loads static/contentIndex.json)
      const contentData = await (window.fetchData || fetch('./static/contentIndex.json').then(r => r.json()));
      
      // Extract all pages with dates
      const pages = Object.entries(contentData)
        .filter(([slug, data]) => {
          // Filter out index pages and nav page itself
          if (slug === 'nav' || slug === 'index' || slug.endsWith('/index')) return false;
          // Only include pages with dates
          return data.dates?.modified || data.dates?.created;
        })
        .map(([slug, data]) => ({
          slug,
          title: data.title || slug.split('/').pop().replace(/-/g, ' '),
          date: data.dates?.modified || data.dates?.created,
          tags: data.tags || []
        }));
      
      // Sort by date (newest first)
      pages.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Take top 6
      const recentNotes = pages.slice(0, 6);
      
      if (recentNotes.length > 0) {
        const formatDate = (dateStr) => {
          const date = new Date(dateStr);
          const now = new Date();
          const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 0) return 'Today';
          if (diffDays === 1) return 'Yesterday';
          if (diffDays < 7) return `${diffDays} days ago`;
          if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        };
        
        const getFirstTag = (tags) => {
          if (!tags || tags.length === 0) return 'Note';
          return tags[0];
        };
        
        recentList.innerHTML = recentNotes.map(note => {
          const tag = getFirstTag(note.tags);
          const displayDate = formatDate(note.date);
          const path = './' + note.slug;
          
          return `
            <li>
              <a href="${path}">
                <span>${note.title} <span class="tag">${tag}</span></span>
                <span class="meta">${displayDate}</span>
              </a>
            </li>
          `;
        }).join('');
      } else {
        recentList.innerHTML = '<li><em>No notes found</em></li>';
      }
    } catch (error) {
      console.error('Error loading recent notes:', error);
      recentList.innerHTML = '<li><em>Unable to load recent notes</em></li>';
    }
  }
  
  // Load recent notes
  loadRecentNotes();
  
  // Refresh on SPA navigation
  document.addEventListener('nav', loadRecentNotes);
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
