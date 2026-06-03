---
title: About me
---

<style>
.hero {
  text-align: center;
  padding: 3rem 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--dark) 0%, var(--secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero .subtitle {
  font-size: 1.1rem;
  color: var(--darkgray);
  margin-bottom: 2rem;
}

.hero .affiliation {
  font-size: 0.95rem;
  color: var(--darkgray);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.hero .research-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.hero .research-tags span {
  background: var(--lightgray);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--dark);
}

.hero .links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero .links a {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 1rem;
  background: var(--secondary);
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: opacity 0.2s;
}

.hero .links a:hover {
  opacity: 0.9;
}

.section {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.section h2 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--dark);
  border-bottom: 2px solid var(--lightgray);
  padding-bottom: 0.3rem;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--lightgray);
  border-radius: 8px;
  border-left: 3px solid var(--secondary);
}

.timeline-item .time {
  font-size: 0.85rem;
  color: var(--darkgray);
  white-space: nowrap;
  min-width: 120px;
}

.timeline-item .content {
  flex: 1;
}

.timeline-item .content h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: var(--dark);
}

.timeline-item .content p {
  font-size: 0.9rem;
  color: var(--darkgray);
  margin: 0;
  line-height: 1.5;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.note-card {
  padding: 1rem;
  background: var(--lightgray);
  border-radius: 8px;
  border-left: 3px solid var(--tertiary);
  transition: transform 0.2s;
}

.note-card:hover {
  transform: translateY(-2px);
}

.note-card h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--dark);
}

.note-card p {
  font-size: 0.85rem;
  color: var(--darkgray);
  margin: 0;
}

.note-card a {
  color: var(--secondary);
  text-decoration: none;
}
</style>

<div class="hero">
  <h1>Jin Qian <span style="font-size: 1.5rem; font-weight: 400; -webkit-text-fill-color: var(--darkgray)">钱晋</span></h1>
  
  <div class="subtitle">Ph.D. Candidate in Computer Graphics</div>
  
  <div class="affiliation">
    Hangzhou Dianzi University (HDU)<br>
    School of Computer Science<br>
    Intelligent Visualization, Modeling and Simulation (iGame) Lab
  </div>
  
  <div class="research-tags">
    <span>Mesh Processing</span>
    <span>Geometric Computing</span>
    <span>Computer Graphics</span>
  </div>
  
  <div class="links">
    <a href="https://orcid.org/0009-0007-2207-7710" target="_blank">📄 ORCID</a>
    <a href="https://github.com/ExactWit" target="_blank">💻 GitHub</a>
    <a href="mailto:chillypepper@foxmail.com">✉️ Email</a>
  </div>
</div>

<div class="section">
  <h2>Research Experience</h2>
  <div class="timeline">
    <div class="timeline-item">
      <div class="time">2025.12 - 2026.05</div>
      <div class="content">
        <h3>NetEase Cloud Music · Research Intern</h3>
        <p>Recommendation Algorithm Group. Research on deep neural networks in recommendation scenarios, based on manifold Hyper Connection and Attention Residuals from LLM frontier works.</p>
      </div>
    </div>
    <div class="timeline-item">
      <div class="time">2024.10 - 2026.05</div>
      <div class="content">
        <h3>HDU Big Data Institute · Researcher</h3>
        <p>Recommendation systems and data mining. Published one paper (see ORCID profile).</p>
      </div>
    </div>
  </div>
</div>

<div class="section">
  <h2>Education</h2>
  <div class="timeline">
    <div class="timeline-item">
      <div class="time">2026 - Present</div>
      <div class="content">
        <h3>Ph.D. Student in Computer Science</h3>
        <p>Hangzhou Dianzi University · School of Computer Science</p>
      </div>
    </div>
    <div class="timeline-item">
      <div class="time">2022 - 2026</div>
      <div class="content">
        <h3>B.Sc. in Computer Science</h3>
        <p>Hangzhou Dianzi University · School of Computer Science</p>
      </div>
    </div>
  </div>
</div>

<div class="section">
  <h2>Notes & Knowledge Base</h2>
  <div class="notes-grid">
    <div class="note-card">
      <h3><a href="./cg/">Computer Graphics</a></h3>
      <p>Curves, surfaces, mesh processing, and geometric modeling</p>
    </div>
  </div>
</div>

<div class="section" style="text-align: center; margin-top: 3rem; padding-bottom: 2rem;">
  <p style="font-size: 0.85rem; color: var(--gray);">
    Interested in Abstract Algebra · Challenging Algebraic Geometry
  </p>
</div>
