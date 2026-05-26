import { Clock3, ExternalLink, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react'
import type { PublicSite, RegistrationStatus, SiteTag } from '../data/sites'

const tagClass: Record<SiteTag, string> = {
  推荐: 'tag-recommend',
  免费模型: 'tag-free-model',
  限注: 'tag-limited',
  试用额度: 'tag-trial',
  签到: 'tag-checkin',
  生图: 'tag-image',
  稳定: 'tag-stable',
  新站: 'tag-new',
}

const registrationLabel: Record<Exclude<RegistrationStatus, 'open'>, string> = {
  limited: '定时注册',
  closed: '暂不开放',
}

const registrationClass: Record<Exclude<RegistrationStatus, 'open'>, string> = {
  limited: 'registration-limited',
  closed: 'registration-closed',
}

type SiteCardProps = {
  site: PublicSite
}

export function SiteCard({ site }: SiteCardProps) {
  return (
    <article className="site-card" data-kind={site.kind}>
      <div className="site-card__topline">
        <div>
          <h2>{site.name}</h2>
          <p className="site-domain">{site.domain}</p>
        </div>
        <div className="site-tags" aria-label={`${site.name} 标签`}>
          {site.kind === 'official' ? (
            <span className="tag tag-official" title="官方入口">
              官方
            </span>
          ) : null}
          {site.kind === 'recommended' ? (
            <span className="tag tag-recommend" title="推荐">
              <Sparkles aria-hidden="true" size={13} />
              推荐
            </span>
          ) : null}
          {site.tags.map((tag) => (
            <span className={`tag ${tagClass[tag]}`} key={tag}>
              {tag === '稳定' ? <ShieldCheck aria-hidden="true" size={13} /> : null}
              {tag}
            </span>
          ))}
        </div>
      </div>
      {site.registrationStatus && site.registrationStatus !== 'open' ? (
        <div className={`registration-note ${registrationClass[site.registrationStatus]}`}>
          {site.registrationStatus === 'limited' ? (
            <Clock3 aria-hidden="true" size={15} />
          ) : (
            <LockKeyhole aria-hidden="true" size={15} />
          )}
          <span>{registrationLabel[site.registrationStatus]}</span>
          {site.registrationNote ? <p>{site.registrationNote}</p> : null}
        </div>
      ) : null}
      {site.usageNote ? (
        <div className="usage-note">
          <span>使用提示</span>
          <p>{site.usageNote}</p>
        </div>
      ) : null}
      <p className="site-summary">{site.summary}</p>
      <div className="dengdeng-says">
        <span>蹬蹬说</span>
        <p>{site.dengdengSays}</p>
      </div>
      <p className="site-description">{site.description}</p>
      <a className="open-link" href={site.url} rel="noreferrer" target="_blank">
        打开链接
        <ExternalLink aria-hidden="true" size={16} />
      </a>
    </article>
  )
}
