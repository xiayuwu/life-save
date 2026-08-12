import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Database, Download, Sparkles, Upload, UserRound } from 'lucide-react'
import { useState } from 'react'
import type { Profile } from '../types'
import { AmbientBackground } from '../components/AmbientBackground'
import { Field, Input, Textarea } from '../components/ui/Field'
import { Logo } from '../components/ui/Logo'

const accents = ['#8ca8ff', '#b697ff', '#ff9fcb', '#75ddcf', '#ffb279', '#e7efff']

export function OnboardingPage({ onComplete, onDemo, onImport }: { onComplete: (profile: Profile) => Promise<void>; onDemo: () => Promise<void>; onImport: () => void }) {
  const [step, setStep] = useState(0)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ nickname: '', birthday: '', bio: '', status: '正在加载新的人生章节', accent: accents[0], chapter: '当前章节' })
  const complete = async () => {
    if (!form.nickname.trim()) return
    setBusy(true)
    await onComplete({ id: 'player', nickname: form.nickname.trim(), birthday: form.birthday || undefined, bio: form.bio, status: form.status, accent: form.accent, tags: [], joinedAt: new Date().toISOString(), onboardingComplete: true })
  }
  const demo = async () => { setBusy(true); await onDemo() }
  const steps = [
    <div className="onboard-welcome" key="welcome"><div className="system-seal"><Database /><i /><i /></div><span>INITIALIZING REALITY ARCHIVE</span><h1>WELCOME TO<br /><b>LIFE//SAVE</b></h1><p>你的现实人生，也值得拥有一个存档界面。<br />所有数据默认只保存在这台设备的浏览器里。</p><div className="onboard-choice"><button className="button button--primary" onClick={() => setStep(1)}>CREATE SAVE FILE <ArrowRight size={16} /></button><button className="button button--secondary" onClick={demo} disabled={busy}><Sparkles size={15} /> {busy ? '正在创建…' : '进入 Demo Mode'}</button><button className="button button--ghost" onClick={onImport}><Upload size={15} /> 导入已有存档</button></div></div>,
    <div className="onboard-form" key="profile"><span>STEP 01 / PLAYER PROFILE</span><h2>创建当前玩家</h2><p>这不是注册账号。它只是你的人生存档封面。</p><div className="avatar-creator"><div style={{ '--accent': form.accent } as React.CSSProperties}><UserRound /></div><small>头像可以稍后在个人主页修改</small></div><Field label="玩家昵称"><Input autoFocus value={form.nickname} onChange={(event) => setForm({ ...form, nickname: event.target.value })} placeholder="你希望系统如何称呼你？" /></Field><div className="form-grid"><Field label="生日" hint="可选"><Input type="date" value={form.birthday} onChange={(event) => setForm({ ...form, birthday: event.target.value })} /></Field><Field label="当前状态"><Input value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} /></Field></div><Field label="个人简介" hint="可选"><Textarea rows={3} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} placeholder="现在的你，是什么样的人？" /></Field><Field label="存档强调色"><div className="accent-picker">{accents.map((color) => <button key={color} style={{ background: color }} className={form.accent === color ? 'active' : ''} onClick={() => setForm({ ...form, accent: color })}>{form.accent === color && <Check size={13} />}</button>)}</div></Field><div className="onboard-nav"><button className="button button--text" onClick={() => setStep(0)}><ArrowLeft size={15} /> 返回</button><button className="button button--primary" disabled={!form.nickname.trim()} onClick={() => setStep(2)}>下一步 <ArrowRight size={15} /></button></div></div>,
    <div className="onboard-final" key="final"><span>STEP 02 / SAVE FILE</span><h2>存档槽位已准备</h2><div className="save-slot"><small>SLOT 01 · LOCAL FIRST</small><div className="avatar" style={{ '--accent': form.accent } as React.CSSProperties}>{form.nickname.slice(0, 1)}</div><h3>{form.nickname}</h3><p>{form.status}</p><div><span>CHAPTER 00</span><b>{form.chapter}</b></div><i /></div><div className="privacy-note"><Download size={19} /><div><b>你的数据属于你</b><p>存档保存在 IndexedDB，可随时完整导出为 JSON。无需注册，不上传云端。</p></div></div><div className="onboard-nav"><button className="button button--text" onClick={() => setStep(1)}><ArrowLeft size={15} /> 返回</button><button className="button button--primary" onClick={complete} disabled={busy}>{busy ? '正在写入…' : '进入 LIFE//SAVE'} <ArrowRight size={15} /></button></div></div>,
  ]
  return <main className="onboarding"><AmbientBackground /><header><Logo /></header><div className="onboarding__progress">{steps.map((_, index) => <i key={index} className={index <= step ? 'active' : ''} />)}</div><AnimatePresence mode="wait"><motion.section key={step} className="onboarding__panel" initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -25 }}>{steps[step]}</motion.section></AnimatePresence><footer>LOCAL SAVE · SCHEMA V1 · NO ACCOUNT REQUIRED</footer></main>
}
