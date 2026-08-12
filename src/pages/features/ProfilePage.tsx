import { CalendarDays, Check, Edit3, Heart, Palette, Save, ShieldCheck, Sparkles, Trophy, UserRound } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import type { Profile } from '../../types'
import { formatDay, Meter, PageIntro, Panel, runAction, splitTags, Stat } from './shared'
import type { FeaturePageProps } from './types'

const fallbackProfile = (): Profile => ({ id: 'player', nickname: '玩家', bio: '', status: '世界仍在运行', accent: '#8294ff', tags: [], joinedAt: new Date().toISOString(), onboardingComplete: true })

export function ProfilePage({ profile: source, saves = [], people = [], events = [], quests = [], achievements = [], actions }: FeaturePageProps) {
  const [profile, setProfile] = useState<Profile>(source ?? fallbackProfile())
  const [draft, setDraft] = useState<Profile>(profile)
  const [editing, setEditing] = useState(false)
  const experience = saves.length * 12 + events.length * 8 + people.length * 20 + quests.filter((item) => item.status === 'completed').length * 25 + achievements.filter((item) => item.unlockedAt).length * 40
  const level = Math.floor(Math.sqrt(experience / 80)) + 1
  const levelFloor = (level - 1) ** 2 * 80
  const nextLevel = level ** 2 * 80
  const levelProgress = Math.round((experience - levelFloor) / Math.max(1, nextLevel - levelFloor) * 100)
  const unlocked = achievements.filter((item) => item.unlockedAt)
  const joinedDays = Math.max(1, Math.floor((Date.now() - new Date(profile.joinedAt).getTime()) / 86400000) + 1)
  const title = useMemo(() => {
    if (saves.length >= 100) return '存档狂魔'
    if (quests.filter((item) => item.status === 'completed').length >= 30) return '支线任务大师'
    if (people.length >= 20) return '角色收藏家'
    if (events.length >= 30) return '世界线观察员'
    return '人生存档新手'
  }, [saves, quests, people, events])
  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (!draft.nickname.trim()) return
    const value = { ...draft, nickname: draft.nickname.trim(), accent: draft.accent || '#8294ff' }
    await runAction(actions, 'update', 'profile', value); setProfile(value); setDraft(value); setEditing(false)
  }
  const cancel = () => { setDraft(profile); setEditing(false) }

  return <main className="feature-page profile-page" style={{ '--fp-accent': profile.accent } as React.CSSProperties}><PageIntro code="PLAYER PROFILE / LIFE IDENTITY" title="个人主页" description="这是你在 LIFE//SAVE 中的玩家档案：身份、状态、等级与已经解锁的人生证据。" actions={<button className="fp-button fp-button--primary" onClick={() => setEditing(true)}><Edit3 size={15} />编辑资料</button>} />
    <Panel accent className="profile-hero"><div className="profile-avatar" style={{ '--profile': profile.accent } as React.CSSProperties}>{profile.avatar ? <img src={profile.avatar} alt={profile.nickname} /> : <span>{profile.nickname.slice(0, 1).toUpperCase()}</span>}<i>LV.{level}</i></div><div className="profile-copy"><span className="fp-kicker">PLAYER ONE / {title.toUpperCase()}</span><h2>{profile.nickname}</h2><p className="profile-status"><span />{profile.status || '世界仍在运行'}</p><p>{profile.bio || '还没有写个人简介。你可以只留一句现在最像自己的话。'}</p><div className="fp-chip-list">{profile.tags.length ? profile.tags.map((tag) => <span className="fp-chip active" key={tag}>#{tag}</span>) : <span className="fp-muted">暂无个人标签</span>}</div></div><div className="profile-level"><strong>{experience}</strong><span>TOTAL XP</span><Meter value={levelProgress} label={`LEVEL ${level} → ${level + 1}`} color={profile.accent} /><small>还需 {Math.max(0, nextLevel - experience)} XP 升级</small></div></Panel>
    <div className="fp-grid fp-grid--4"><Panel><Stat label="JOINED" value={formatDay(profile.joinedAt)} note={`共同运行 ${joinedDays} 天`} /></Panel><Panel><Stat label="LIFE SAVES" value={saves.length} note="生活存档" /></Panel><Panel><Stat label="CHARACTERS" value={people.length} note="人物图鉴" /></Panel><Panel><Stat label="ACHIEVEMENTS" value={unlocked.length} note={`共 ${achievements.length} 枚`} /></Panel></div>
    <div className="fp-grid fp-grid--2"><Panel title="PLAYER CARD"><div className="profile-facts"><article><UserRound /><div><span>当前称号</span><b>{title}</b></div></article><article><Heart /><div><span>当前状态</span><b>{profile.status || '未设置'}</b></div></article><article><CalendarDays /><div><span>生日</span><b>{profile.birthday ? formatDay(profile.birthday) : '未设置'}</b></div></article><article><Palette /><div><span>身份色</span><b><i style={{ background: profile.accent }} />{profile.accent}</b></div></article></div></Panel><Panel title="RECENT ACHIEVEMENTS" meta={<Trophy size={17} />}>{unlocked.length ? <div className="profile-achievements">{unlocked.slice().sort((a, b) => (b.unlockedAt || '').localeCompare(a.unlockedAt || '')).slice(0, 5).map((item) => <article key={item.id}><span><Sparkles /></span><div><b>{item.title}</b><p>{item.description}</p></div><small>{formatDay(item.unlockedAt)}</small></article>)}</div> : <div className="profile-achievements profile-achievements--empty"><ShieldCheck /><p>成就仍是锁定状态。继续记录，它们会根据真实数据自动解锁。</p></div>}</Panel></div>
    {editing && <div className="fp-popover" onMouseDown={(e) => e.target === e.currentTarget && cancel()}><form className="fp-dialog" onSubmit={submit}><div className="fp-dialog__head"><div><span className="fp-kicker">EDIT PLAYER PROFILE</span><h2>编辑个人资料</h2></div><button type="button" className="fp-button fp-button--ghost" onClick={cancel}>取消</button></div><div className="fp-form-grid"><label className="fp-field"><span>昵称 *</span><input autoFocus required className="fp-input" value={draft.nickname} onChange={(e) => setDraft((item) => ({ ...item, nickname: e.target.value }))} /></label><label className="fp-field"><span>生日</span><input className="fp-input" type="date" value={draft.birthday || ''} onChange={(e) => setDraft((item) => ({ ...item, birthday: e.target.value || undefined }))} /></label><label className="fp-field"><span>当前状态</span><input className="fp-input" value={draft.status} onChange={(e) => setDraft((item) => ({ ...item, status: e.target.value }))} /></label><label className="fp-field"><span>喜欢的颜色</span><input className="fp-input" type="color" value={draft.accent} onChange={(e) => setDraft((item) => ({ ...item, accent: e.target.value }))} /></label><label className="fp-field fp-field--wide"><span>头像地址</span><input className="fp-input" type="url" value={draft.avatar || ''} onChange={(e) => setDraft((item) => ({ ...item, avatar: e.target.value || undefined }))} placeholder="https://…（可留空使用文字头像）" /></label><label className="fp-field fp-field--wide"><span>个人简介</span><textarea className="fp-textarea" value={draft.bio} onChange={(e) => setDraft((item) => ({ ...item, bio: e.target.value }))} /></label><label className="fp-field fp-field--wide"><span>个人标签</span><input className="fp-input" value={draft.tags.join(' ')} onChange={(e) => setDraft((item) => ({ ...item, tags: splitTags(e.target.value) }))} placeholder="游戏 夜猫子 旅行" /></label></div><div className="fp-divider" /><div className="fp-actions"><button className="fp-button fp-button--primary"><Save size={15} />保存资料</button><button type="button" className="fp-button" onClick={cancel}><Check size={15} />保持原样</button></div></form></div>}
  </main>
}
