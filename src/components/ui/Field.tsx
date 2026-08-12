import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="field"><span>{label}{hint && <small>{hint}</small>}</span>{children}</label>
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) { return <input className="input" {...props} /> }
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className="input textarea" {...props} /> }
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) { return <select className="input select" {...props} /> }

export function Range({ value, onChange, min = 0, max = 100, label }: { value: number; onChange: (value: number) => void; min?: number; max?: number; label?: string }) {
  return <div className="range-control"><input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} aria-label={label} /><b>{value}</b></div>
}
