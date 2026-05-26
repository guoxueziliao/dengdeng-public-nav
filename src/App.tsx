import { Clock3, ExternalLink, GitBranch, Mail, Megaphone } from 'lucide-react'
import { useMemo, useState } from 'react'
import './App.css'
import { FilterBar } from './components/FilterBar'
import { SiteCard } from './components/SiteCard'
import { siteConfig } from './data/config'
import { filters, sites, type SiteTag } from './data/sites'

function App() {
  const [activeFilters, setActiveFilters] = useState<SiteTag[]>([])

  const visibleSites = useMemo(() => {
    return sites
      .filter((site) => activeFilters.every((filter) => site.tags.includes(filter)))
      .sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name))
  }, [activeFilters])

  const recommendedCount = sites.filter((site) => site.kind === 'recommended').length
  const highlightedSites = useMemo(() => {
    return sites
      .filter((site) => site.highlight)
      .sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name))
  }, [])

  const toggleFilter = (filter: SiteTag) => {
    setActiveFilters((currentFilters) =>
      currentFilters.includes(filter)
        ? currentFilters.filter((currentFilter) => currentFilter !== filter)
        : [...currentFilters, filter],
    )
  }

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <div className="hero-panel__heading">
          <div className="brand-mark" aria-hidden="true">
            蹬
          </div>
          <div>
            <p className="eyebrow">Public Relay Navigation</p>
            <h1>{siteConfig.name}</h1>
          </div>
        </div>

        <p className="hero-copy">{siteConfig.description}</p>
        <p className="notice">{siteConfig.notice}</p>

        <div className="hero-meta" aria-label="站点概况">
          <span>共收录 {sites.length} 个站点</span>
          <span>{recommendedCount} 个推荐项</span>
          <a href={`mailto:${siteConfig.contactEmail}`}>
            <Mail aria-hidden="true" size={16} />
            联系收录
          </a>
          <a
            href={`https://github.com/search?q=${siteConfig.repositoryName}`}
            rel="noreferrer"
            target="_blank"
          >
            <GitBranch aria-hidden="true" size={16} />
            GitHub 项目
          </a>
        </div>

        <FilterBar
          activeFilters={activeFilters}
          filters={filters}
          onReset={() => setActiveFilters([])}
          onToggle={toggleFilter}
        />
      </section>

      <section className="sponsor-strip" aria-label="站点维护说明">
        <div>
          <Megaphone aria-hidden="true" size={18} />
          <strong>站点维护说明</strong>
        </div>
        <p>列表会优先整理可访问、信息清楚、反馈较多的公益站点，失效或关闭注册会逐步标注。</p>
      </section>

      <section className="highlight-section" aria-label="限时开放与临时额度">
        <div className="section-heading">
          <Clock3 aria-hidden="true" size={20} />
          <div>
            <h2>限时开放与临时额度</h2>
            <p>这里单独放注册窗口、短期福利、临时免费模型和阶段性额度，优先看时效。</p>
          </div>
        </div>
        <div className="highlight-grid">
          {highlightedSites.map((site) => (
            <a className="highlight-card" href={site.url} key={site.domain} rel="noreferrer" target="_blank">
              <span>{site.highlight?.title}</span>
              <strong>{site.name}</strong>
              <p>{site.highlight?.note}</p>
              <small>
                打开链接
                <ExternalLink aria-hidden="true" size={14} />
              </small>
            </a>
          ))}
        </div>
      </section>

      <section className="site-grid" aria-label="公益站列表">
        {visibleSites.map((site) => (
          <SiteCard key={site.domain} site={site} />
        ))}
      </section>
    </main>
  )
}

export default App
