#!/usr/bin/env node
/**
 * 从 ORCID API 获取 Publications 并更新到首页
 * 运行方式：node scripts/fetch-orcid.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ORCID_ID = process.env.ORCID_ID || '0009-0007-2207-7710';
const INDEX_PATH = path.join(__dirname, '..', 'content', 'index.md');

async function fetchPublications() {
  try {
    console.log('📚 Fetching publications from ORCID...');
    
    // ORCID API endpoint for works
    const response = await fetch(`https://pub.orcid.org/v3.0/${ORCID_ID}/works`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const works = data.group || [];
    
    // Sort by citation count (if available) or year
    const sortedWorks = works
      .map(group => {
        const work = group['work-summary']?.[0];
        if (!work) return null;
        
        const title = work.title?.title?.value || 'Untitled';
        const type = work.type || 'Unknown';
        const pubDate = work['publication-date'];
        const year = pubDate?.year?.value || 'N/A';
        const month = pubDate?.month?.value;
        const day = pubDate?.day?.value;
        
        // Get journal/conference info
        const journalTitle = work['journal-title']?.value || '';
        
        // Get external IDs (DOI, etc.)
        const externalIds = work['external-ids']?.['external-id'] || [];
        const doi = externalIds.find(id => id['external-id-type'] === 'doi')?.['external-id-value'];
        
        // Get URL
        const url = work.url?.value || 
                   (doi ? `https://doi.org/${doi}` : null);
        
        return {
          title,
          year,
          month,
          day,
          type,
          journalTitle,
          doi,
          url,
          // Note: ORCID free API doesn't provide citation counts
          // Would need to integrate with CrossRef, Semantic Scholar, etc.
          citations: null
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        // Sort by year (descending), then month
        if (b.year !== a.year) return parseInt(b.year) - parseInt(a.year);
        if (b.month && a.month) return parseInt(b.month) - parseInt(a.month);
        return 0;
      });
    
    return sortedWorks;
  } catch (error) {
    console.error('❌ Error fetching ORCID data:', error.message);
    return [];
  }
}

function generatePublicationsHTML(publications) {
  if (publications.length === 0) {
    return '';
  }
  
  let html = `
<div class="publications-section">
  <h2>Publications</h2>
  <div class="publications-list">
`;
  
  publications.forEach((pub, index) => {
    const date = [pub.year, pub.month, pub.day].filter(Boolean).join('-');
    const venue = pub.journalTitle || pub.type;
    const link = pub.url ? `<a href="${pub.url}" target="_blank">${pub.title}</a>` : pub.title;
    
    html += `    <div class="publication-item">
      <div class="pub-title">${link}</div>
      <div class="pub-meta">
        <span class="pub-venue">${venue}</span>
        <span class="pub-year">${date}</span>
      </div>
    </div>
`;
  });
  
  html += `  </div>
</div>

<style>
.publications-section {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.publications-section h2 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--dark);
  border-bottom: 2px solid var(--lightgray);
  padding-bottom: 0.3rem;
}

.publications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.publication-item {
  padding: 1rem;
  background: var(--lightgray);
  border-radius: 8px;
  border-left: 3px solid var(--secondary);
  transition: transform 0.2s;
}

.publication-item:hover {
  transform: translateX(4px);
}

.pub-title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.3rem;
  color: var(--dark);
}

.pub-title a {
  color: var(--secondary);
  text-decoration: none;
}

.pub-title a:hover {
  text-decoration: underline;
}

.pub-meta {
  font-size: 0.85rem;
  color: var(--darkgray);
  display: flex;
  gap: 1rem;
}

.pub-venue {
  font-style: italic;
}

.pub-year {
  color: var(--gray);
}
</style>
`;
  
  return html;
}

async function updateIndexPage(publications) {
  try {
    console.log('📝 Updating index.md...');
    
    let content = fs.readFileSync(INDEX_PATH, 'utf8');
    
    // Generate the publications section
    const pubSection = generatePublicationsHTML(publications);
    
    // Check if there's already a publications section (between markers)
    const startMarker = '<!-- PUBLICATIONS_START -->';
    const endMarker = '<!-- PUBLICATIONS_END -->';
    
    if (content.includes(startMarker) && content.includes(endMarker)) {
      // Replace existing section
      const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'g');
      content = content.replace(regex, `${startMarker}\n${pubSection}\n${endMarker}`);
    } else {
      // Add new section before the last section or at the end
      const insertionPoint = content.lastIndexOf('<div class="section"');
      if (insertionPoint !== -1) {
        content = content.slice(0, insertionPoint) + `${startMarker}\n${pubSection}\n${endMarker}\n\n` + content.slice(insertionPoint);
      } else {
        content += `\n\n${startMarker}\n${pubSection}\n${endMarker}`;
      }
    }
    
    fs.writeFileSync(INDEX_PATH, content);
    console.log(`✅ Updated ${INDEX_PATH} with ${publications.length} publications`);
    
  } catch (error) {
    console.error('❌ Error updating index:', error.message);
  }
}

// Main
async function main() {
  const publications = await fetchPublications();
  if (publications.length > 0) {
    await updateIndexPage(publications);
  } else {
    console.log('⚠️ No publications found or error occurred');
  }
}

main();
