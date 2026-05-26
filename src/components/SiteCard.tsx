import { Clock3, ExternalLink, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react'
import type { PublicSite, RegistrationStatus, SiteTag } from '../data/sites'

const tagOrder: SiteTag[] = ['推荐', '免费模型', '限注', '试用额度', '签到', '生图', '稳定', '新站']

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
  const visibleTags = tagOrder.filter((tag) => site.tags.includes(tag))

  return (
    <article className="site-card" data-kind={site.kind}>
      <div className="site-card__topline">
        <div>
          <h2>{site.name}</h2>
          <p className="site-domain">{site.domain}</p>
          <p className="quota-rate">
            <span>倍率</span>
            {site.usdQuotaCost}
          </p>
        </div>
        <div className="site-tags" aria-label={`${site.name} 标签`}>
          {visibleTags.map((tag) => (
            <span className={`tag ${tagClass[tag]}`} key={tag}>
              {tag === '推荐' ? <Sparkles aria-hidden="true" size={13} /> : null}
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
      <p className="site-description">{site.description}</p>
      <a className="open-link" href={site.url} rel="noreferrer" target="_blank">
        打开链接
        <ExternalLink aria-hidden="true" size={16} />
      </a>
      {site.dengdengSays ? (
        <div className="dengdeng-says">
          <span>蹬蹬说</span>
          <p>{site.dengdengSays}</p>
        </div>
      ) : null}
    </article>
  )
}
