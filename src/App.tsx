import { Clock3, ExternalLink, GitBranch, Mail, Megaphone, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import './App.css'
import { FilterBar } from './components/FilterBar'
import { SiteCard } from './components/SiteCard'
import { siteConfig } from './data/config'
import { filters, sites, type SiteTag } from './data/sites'

function App() {
  const [activeFilters, setActiveFilters] = useState<SiteTag[]>([])
  const [isContactVisible, setIsContactVisible] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [searchText, setSearchText] = useState('')

  const visibleSites = useMemo(() => {
    const normalizedSearchText = searchText.trim().toLowerCase()

    return sites
      .filter((site) => activeFilters.every((filter) => site.tags.includes(filter)))
      .filter((site) => {
        if (!normalizedSearchText) {
          return true
        }

        const searchableValues = [
          site.name,
          site.domain,
          site.url,
          site.summary,
          site.description,
          site.usdQuotaCost,
          site.dengdengSays,
          site.registrationNote,
          site.usageNote,
          site.highlight?.title,
          site.highlight?.note,
          ...site.tags,
        ].filter((value): value is string => Boolean(value))

        return searchableValues.some((value) => value.toLowerCase().includes(normalizedSearchText))
      })
      .sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name))
  }, [activeFilters, searchText])

  const recommendedCount = sites.filter((site) => site.tags.includes('推荐')).length
  const highlightedSites = useMemo(() => {
    return sites
      .filter((site) => site.highlight)
      .sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name))
  }, [])
  const suggestionTerms = useMemo(() => {
    const recommendedTerms = [
      '免费模型',
      'Claude',
      'GPT',
      'Codex',
      '生图',
      '签到',
      '推荐',
      '0.06:1',
      '最低 0.083:1',
    ]
    const siteTerms = sites.flatMap((site) => [
      site.name,
      site.domain,
      site.usdQuotaCost,
      site.highlight?.title,
      ...site.tags,
      ...site.description.split(/[，。、；：,;:\s]+/).filter((term) => term.length >= 2 && term.length <= 28),
    ])

    return Array.from(new Set([...recommendedTerms, ...siteTerms].filter((term): term is string => Boolean(term))))
  }, [])
  const searchSuggestions = useMemo(() => {
    const normalizedSearchText = searchText.trim().toLowerCase()

    if (!normalizedSearchText) {
      return suggestionTerms.slice(0, 9)
    }

    return suggestionTerms
      .filter((term) => term.toLowerCase().includes(normalizedSearchText))
      .slice(0, 9)
  }, [searchText, suggestionTerms])

  const toggleFilter = (filter: SiteTag) => {
    setActiveFilters((currentFilters) =>
      currentFilters.includes(filter)
        ? currentFilters.filter((currentFilter) => currentFilter !== filter)
        : [...currentFilters, filter],
    )
  }

  return (
    <main className="page-shell">
      <a className="floating-brand" href={siteConfig.siteUrl}>
        <span>蹬蹬公益站导航</span>
        <small>{siteConfig.siteUrl.replace('https://', '')}</small>
      </a>

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
        <a className="share-source" href={siteConfig.siteUrl}>
          分享认准：{siteConfig.siteUrl.replace('https://', '')}
        </a>

        <div className="hero-meta" aria-label="站点概况">
          <span>共收录 {sites.length} 个站点</span>
          <span>{recommendedCount} 个推荐项</span>
          <button
            aria-expanded={isContactVisible}
            onClick={() => setIsContactVisible((currentValue) => !currentValue)}
            type="button"
          >
            <Mail aria-hidden="true" size={16} />
            联系收录
          </button>
          {isContactVisible ? <span className="contact-email">{siteConfig.contactEmail}</span> : null}
          <a href={siteConfig.repositoryUrl} rel="noreferrer" target="_blank">
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

        <div className="search-panel">
          <label className="search-box">
            <Search aria-hidden="true" size={18} />
            <input
              aria-autocomplete="list"
              aria-label="搜索站点"
              onBlur={() => setIsSearchFocused(false)}
              onChange={(event) => setSearchText(event.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="搜索名称、模型、域名、标签或蹬蹬说"
              type="search"
              value={searchText}
            />
          </label>
          {isSearchFocused && searchSuggestions.length > 0 ? (
            <div className="search-suggestions" role="listbox">
              <span>{searchText.trim() ? '联想搜索' : '推荐搜索'}</span>
              {searchSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    setSearchText(suggestion)
                    setIsSearchFocused(false)
                  }}
                  type="button"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}
        </div>
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
        {visibleSites.length > 0 ? (
          visibleSites.map((site) => <SiteCard key={site.domain} site={site} />)
        ) : (
          <div className="empty-state">没有找到匹配的站点</div>
        )}
      </section>

      <footer className="site-footer">
        <div>
          <strong>{siteConfig.name}</strong>
          <span>公开公益站与免费模型导航</span>
        </div>
        <a href={siteConfig.siteUrl}>{siteConfig.siteUrl.replace('https://', '')}</a>
      </footer>
    </main>
  )
}

export default App
