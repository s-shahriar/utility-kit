import { useState, useMemo } from 'react'
import {
  ChevronLeft, Search, BookOpen, Zap, Star,
  ArrowRight, CheckCircle, XCircle, Trophy, Home,
  OctagonX, Minus, Plus, ChevronDown, ChevronUp, X,
} from 'lucide-react'
import { FIN_CATEGORIES, FIN_CARDS, FIN_QUIZ, FIN_QUIZ_CATS } from '../data/finTermsData'
import './FinancialTerms.css'

const ALL_CATS = ['সব', ...Object.keys(FIN_CATEGORIES)]

/* ── localStorage helpers ─────────────────────── */
function loadNailed() {
  try { return new Set(JSON.parse(localStorage.getItem('utility-fin-nailed') ?? '[]')) }
  catch { return new Set() }
}
function saveNailed(set) {
  localStorage.setItem('utility-fin-nailed', JSON.stringify([...set]))
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ── Root component ───────────────────────────── */
export default function FinancialTerms({ onBack }) {
  const [tab, setTab]           = useState('ref')
  const [quizPhase, setQuizPhase] = useState('config') // 'config' | 'running'
  const [nailed, setNailed]     = useState(loadNailed)

  const nail = (id) => setNailed(prev => {
    const s = new Set(prev); s.add(id); saveNailed(s); return s
  })
  const unnail = (id) => setNailed(prev => {
    const s = new Set(prev); s.delete(id); saveNailed(s); return s
  })

  // Hide tabs while quiz is actually running (matches ICT quiz full-screen feel)
  const showTabs = !(tab === 'quiz' && quizPhase === 'running')

  return (
    <div className="ft-root">
      {/* Top bar — always visible */}
      <div className="ft-topbar">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={15} /> হোম
        </button>
        <span className="ft-topbar-title">ফিনান্সিয়াল টার্ম</span>
        {nailed.size > 0 && tab !== 'nailed' && showTabs && (
          <button
            className="ft-topbar-count"
            style={{cursor:'pointer',borderColor:'rgba(245,158,11,0.35)',color:'#b45309',background:'rgba(245,158,11,0.1)'}}
            onClick={() => setTab('nailed')}
            title="নেইলড প্রশ্নগুলো দেখুন"
          >
            <Star size={11} fill="currentColor" style={{marginRight:4,verticalAlign:'middle'}} />
            {nailed.size} নেইলড
          </button>
        )}
      </div>

      {/* Tab bar — hidden while quiz is running */}
      {showTabs && (
        <div className="ft-tabs">
          <button className={`ft-tab-btn${tab === 'ref' ? ' active' : ''}`} onClick={() => setTab('ref')}>
            <BookOpen size={14} /> রেফারেন্স
          </button>
          <button className={`ft-tab-btn${tab === 'quiz' ? ' active' : ''}`} onClick={() => setTab('quiz')}>
            <Zap size={14} /> কুইজ
          </button>
          <button
            className={`ft-tab-btn${tab === 'nailed' ? ' active' : ''}`}
            onClick={() => setTab('nailed')}
            style={tab !== 'nailed' && nailed.size > 0 ? {color:'#b45309'} : {}}
          >
            <Star size={14} fill={nailed.size > 0 ? 'currentColor' : 'none'} />
            নেইলড
            {nailed.size > 0 && (
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,background:'rgba(245,158,11,0.15)',color:'#b45309',padding:'1px 6px',borderRadius:8,marginLeft:2}}>
                {nailed.size}
              </span>
            )}
          </button>
        </div>
      )}

      {tab === 'ref'    && <RefSection />}
      {tab === 'quiz'   && (
        <QuizSection
          nailed={nailed} nail={nail} unnail={unnail}
          phase={quizPhase} onPhaseChange={setQuizPhase}
        />
      )}
      {tab === 'nailed' && <NailedSection nailed={nailed} unnail={unnail} onBack={() => setTab('ref')} />}
    </div>
  )
}

/* ── Reference section ────────────────────────── */
function RefSection() {
  const [search, setSearch]     = useState('')
  const [activeCat, setActiveCat] = useState('সব')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return FIN_CARDS.filter(c => {
      const matchCat = activeCat === 'সব' || c.cat === activeCat
      if (!q) return matchCat
      return matchCat && (c.title + c.subtitle + c.body + c.cat).toLowerCase().includes(q)
    })
  }, [search, activeCat])

  return (
    <>
      <div className="ft-filter-wrap">
        {ALL_CATS.map(cat => {
          const color = FIN_CATEGORIES[cat]
          const isActive = activeCat === cat
          return (
            <button
              key={cat}
              className={`ft-filter-btn${isActive ? ' active' : ''}`}
              onClick={() => setActiveCat(cat)}
              style={isActive ? {background: color || 'var(--accent)', borderColor: color || 'var(--accent)'} : {}}
            >
              {cat}
            </button>
          )
        })}
      </div>
      <div className="ft-search-wrap">
        <Search className="ft-search-icon" size={15} />
        <input
          className="ft-search-input" type="text"
          placeholder="যেকোনো টপিক খুঁজুন..."
          value={search} onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="ft-grid">
        {filtered.length === 0
          ? <div className="ft-no-results">কোনো ফলাফল পাওয়া যায়নি 🔍</div>
          : filtered.map(card => <TermCard key={card.id} card={card} />)
        }
      </div>
    </>
  )
}

function TermCard({ card }) {
  const color = FIN_CATEGORIES[card.cat] || 'var(--accent)'
  return (
    <div className="ft-card" style={{'--card-color': color}}>
      <div className="ft-card-header">
        <div className="ft-card-icon">{card.icon}</div>
        <div>
          <div className="ft-card-title">{card.title}</div>
          <div className="ft-card-subtitle">{card.subtitle}</div>
        </div>
      </div>
      <div className="ft-card-body" dangerouslySetInnerHTML={{__html: card.body}} />
    </div>
  )
}

/* ── Quiz section (Config → Running → Score) ──── */
function QuizSection({ nailed, nail, unnail, phase, onPhaseChange }) {
  const [questions, setQuestions] = useState([])

  const handleStart = ({ questions: qs }) => {
    setQuestions(qs)
    onPhaseChange('running')
  }
  const handleBack = () => onPhaseChange('config')

  if (phase === 'config') return <QuizConfig onStart={handleStart} />
  return <QuizRunning questions={questions} nailed={nailed} nail={nail} unnail={unnail} onBack={handleBack} />
}

/* ExamConfig clone for Financial Terms */
function QuizConfig({ onStart }) {
  const [catId, setCatId]   = useState('all')
  const [count, setCount]   = useState(10)

  const maxCount = useMemo(() => {
    if (catId === 'all') return FIN_QUIZ.length
    return FIN_QUIZ.filter((_, i) => FIN_QUIZ_CATS[i] === catId).length
  }, [catId])

  const safeCount = Math.max(1, Math.min(count, maxCount))
  const adjust = (d) => setCount(c => Math.max(1, Math.min(c + d, maxCount)))

  const handleStart = () => {
    const pool = FIN_QUIZ
      .map((q, i) => ({
        question: q.q,
        options: { a: q.opts[0], b: q.opts[1], c: q.opts[2], d: q.opts[3] },
        correct_answer: ['a','b','c','d'][q.ans],
        _origIndex: i,
        _cat: FIN_QUIZ_CATS[i],
      }))
      .filter((_, i) => catId === 'all' || FIN_QUIZ_CATS[i] === catId)

    const questions = shuffle(pool).slice(0, safeCount)
    const label = catId === 'all' ? 'সব টপিক' : catId
    onStart({ questions, label })
  }

  return (
    <div className="exam-config-page anim-fade">
      <div className="exam-config-hero">
        <div className="exam-config-icon"><Zap size={30} /></div>
        <h1 className="exam-config-title">কুইজ মোড</h1>
        <p className="exam-config-sub">টপিক বেছে নাও<br />প্রশ্ন সংখ্যা ঠিক করো — শুরু করো</p>
      </div>

      <div className="exam-config-form">
        <div className="exam-field">
          <label className="exam-label">
            টপিক
            <span className="exam-max-hint">{maxCount}টি প্রশ্ন উপলব্ধ</span>
          </label>
          <select
            className="exam-select"
            value={catId}
            onChange={e => { setCatId(e.target.value); setCount(10) }}
          >
            <option value="all">🎲 সব টপিক (Random Mix)</option>
            <optgroup label="──────────────────">
              {Object.entries(FIN_CATEGORIES).map(([cat, color]) => {
                const cnt = FIN_QUIZ.filter((_, i) => FIN_QUIZ_CATS[i] === cat).length
                if (cnt === 0) return null
                return (
                  <option key={cat} value={cat}>{cat} ({cnt} Q)</option>
                )
              })}
            </optgroup>
          </select>
        </div>

        <div className="exam-field">
          <label className="exam-label">
            প্রশ্ন সংখ্যা
            <span className="exam-max-hint">max {maxCount}</span>
          </label>
          <div className="exam-count-row">
            <button className="exam-stepper" onClick={() => adjust(-5)} disabled={safeCount <= 1}>−5</button>
            <button className="exam-stepper" onClick={() => adjust(-1)} disabled={safeCount <= 1}>
              <Minus size={14} />
            </button>
            <span className="exam-count-display">{safeCount}</span>
            <button className="exam-stepper" onClick={() => adjust(1)} disabled={safeCount >= maxCount}>
              <Plus size={14} />
            </button>
            <button className="exam-stepper" onClick={() => adjust(5)} disabled={safeCount >= maxCount}>+5</button>
          </div>
        </div>

        <button className="exam-start-btn" onClick={handleStart} disabled={maxCount === 0}>
          <Zap size={16} />
          কুইজ শুরু করো — {safeCount}টি প্রশ্ন
        </button>
      </div>
    </div>
  )
}

/* Actual running quiz — matches ICT quiz ExamMode exactly */
function QuizRunning({ questions, nailed, nail, unnail, onBack }) {
  const [idx, setIdx]               = useState(0)
  const [selected, setSelected]     = useState(null)
  const [revealed, setRevealed]     = useState(false)
  const [score, setScore]           = useState(0)
  const [done, setDone]             = useState(false)
  const [stopConfirm, setStopConfirm] = useState(false)

  const q        = questions[idx]
  const opts     = q ? ['a','b','c','d'].filter(k => q.options?.[k]) : []
  const qid      = q?._origIndex
  const isNailed = nailed.has(qid)
  const total    = questions.length
  const progress = ((idx + (revealed ? 1 : 0)) / total) * 100
  const isCorrect = selected === q?.correct_answer

  const pick = (key) => {
    if (revealed) return
    setSelected(key)
    setRevealed(true)
    if (key === q.correct_answer) setScore(s => s + 1)
  }

  const next = () => {
    if (idx + 1 >= total) { setDone(true); return }
    setIdx(i => i + 1); setSelected(null); setRevealed(false)
  }

  const restart = () => {
    setIdx(0); setSelected(null); setRevealed(false); setScore(0); setDone(false); setStopConfirm(false)
  }

  const handleStop = () => {
    if (stopConfirm) { setDone(true); return }
    setStopConfirm(true)
    setTimeout(() => setStopConfirm(false), 3000)
  }

  /* ── Score screen ── */
  if (!q || done) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0
    const r = 54, circumference = 2 * Math.PI * r
    const strokeOffset = circumference - (pct / 100) * circumference
    const msg =
      pct >= 80 ? 'অসাধারণ! Exam এ দারুণ করবে!' :
      pct >= 60 ? 'ভালো হয়েছে! আরেকটু মনোযোগ দাও।' :
      pct >= 40 ? 'আরো অনুশীলন দরকার।' : 'হাল ছেড়ো না, আবার চেষ্টা করো!'

    return (
      <div className="score-page anim-fade">
        <div className="score-card">
          <Trophy size={44} className="score-trophy" style={{color:'#6366f1'}} />
          <div className="score-title">কুইজ সম্পন্ন!</div>
          <div className="score-ring-wrap">
            <svg className="score-ring-svg" width="138" height="138" viewBox="0 0 138 138">
              <circle className="score-ring-bg" cx="69" cy="69" r={r} />
              <circle
                className="score-ring-fill" cx="69" cy="69" r={r}
                stroke="#6366f1" strokeDasharray={circumference} strokeDashoffset={strokeOffset}
                style={{filter:'drop-shadow(0 0 8px #6366f1)'}}
              />
            </svg>
            <div className="score-ring-text">
              <div className="score-fraction" style={{color:'#6366f1'}}>
                {score}<span className="score-total">/{total}</span>
              </div>
              <div className="score-pct">{pct}%</div>
            </div>
          </div>
          {nailed.size > 0 && (
            <div style={{marginBottom:12}}>
              <span className="nailed-count-badge">
                <Star size={11} fill="currentColor" style={{marginRight:4,verticalAlign:'middle'}} />
                {nailed.size} Nailed সংরক্ষিত
              </span>
            </div>
          )}
          <div className="score-msg">{msg}</div>
          <div className="score-actions">
            <button className="score-retry" onClick={restart}>আবার দাও</button>
            <button className="score-home" style={{background:'#6366f1'}} onClick={onBack}>
              <Home size={15} /> কনফিগ
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-page anim-fade">
      {/* Topbar */}
      <div className="quiz-topbar">
        <div style={{display:'flex',alignItems:'center',gap:6,fontFamily:"'Space Grotesk',sans-serif",fontSize:'0.78rem',fontWeight:700,padding:'5px 12px',borderRadius:24,background:'var(--elevated)',border:'1px solid var(--border-md)'}}>
          <Zap size={13} style={{color:'var(--accent)'}} />
          <span style={{color:'var(--accent)'}}>কুইজ</span>
          {q._cat && <span style={{color:'var(--text-3)',fontWeight:500,fontFamily:"'JetBrains Mono',monospace",fontSize:'0.72rem'}}>{q._cat}</span>}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span className="quiz-score-pill">{score} / {idx + (revealed ? 1 : 0)}</span>
          <button className={`exam-stop-btn${stopConfirm ? ' confirm' : ''}`} onClick={handleStop}>
            <OctagonX size={14} />
            {stopConfirm ? 'Sure?' : 'শেষ করো'}
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="quiz-progress-wrap">
        <div className="quiz-progress-header">
          <span className="quiz-qnum">প্রশ্ন {idx + 1} of {total}</span>
          <span className="quiz-pct">{Math.round(progress)}%</span>
        </div>
        <div className="quiz-progress-track">
          <div className="quiz-progress-fill" style={{width:`${progress}%`,background:'#6366f1'}} />
        </div>
      </div>

      {/* Question card */}
      <div className="quiz-card anim-slide">
        <p className="quiz-question" style={{fontFamily:"'Noto Serif Bengali',serif"}}>{q.question}</p>

        <div className="quiz-options">
          {opts.map(key => {
            let cls = 'opt-btn'
            if (revealed) {
              if (key === q.correct_answer) cls += ' correct revealed'
              else if (key === selected)    cls += ' wrong revealed'
              else                          cls += ' dim revealed'
            }
            return (
              <button key={key} className={cls} style={{'--c':'#6366f1'}} onClick={() => pick(key)}>
                <span className="opt-key">{key.toUpperCase()}</span>
                <span className="opt-text" style={{fontFamily:"'Noto Sans Bengali','Inter',sans-serif"}}>{q.options[key]}</span>
                {revealed && key === q.correct_answer && <CheckCircle size={15} className="opt-icon" style={{color:'#10b981'}} />}
                {revealed && key === selected && key !== q.correct_answer && <XCircle size={15} className="opt-icon" style={{color:'#ef4444'}} />}
              </button>
            )
          })}
        </div>

        {revealed && (
          <div className="quiz-revealed-actions">
            <button
              className={`quiz-nail-btn${isNailed ? ' nailed' : ''}`}
              onClick={() => isNailed ? unnail(qid) : nail(qid)}
              title={isNailed ? 'Nailed — click to un-nail' : 'Mark as Nailed It'}
            >
              <Star size={18} fill={isNailed ? 'currentColor' : 'none'} strokeWidth={1.8} />
              {isNailed ? 'Nailed!' : 'Nail It'}
            </button>
            <button className="quiz-next-btn" onClick={next}>
              {idx + 1 >= total ? 'ফলাফল দেখুন' : 'পরবর্তী প্রশ্ন'}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Nailed section ───────────────────────────── */
function NailedSection({ nailed, unnail, onBack }) {
  /* Group nailed questions by category */
  const groups = useMemo(() => {
    const map = {}
    nailed.forEach(qid => {
      const cat = FIN_QUIZ_CATS[qid] ?? 'বিবিধ'
      const color = FIN_CATEGORIES[cat] ?? '#94a3b8'
      if (!map[cat]) map[cat] = { cat, color, items: [] }
      const q = FIN_QUIZ[qid]
      if (q) {
        map[cat].items.push({
          qid,
          question: q.q,
          correctOpt: q.opts[q.ans],
          correctKey: ['A','B','C','D'][q.ans],
        })
      }
    })
    return Object.values(map)
  }, [nailed])

  const total = nailed.size

  return (
    <div className="nailed-screen anim-fade">
      <div className="nailed-screen-topbar">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={15} /> রেফারেন্স
        </button>
        <div className="nailed-screen-title">
          <Star size={16} fill="currentColor" style={{color:'#f59e0b'}} />
          Nailed It
        </div>
        <div style={{width:40}} /> {/* spacer to centre title */}
      </div>

      {total === 0 ? (
        <div className="nailed-screen-empty">
          <Star size={48} style={{color:'#f59e0b', opacity:0.3}} />
          <p>এখনো কোনো প্রশ্ন Nail করা হয়নি।</p>
          <span>কুইজ মোডে উত্তর দিয়ে <strong>Nail It</strong> চাপুন — এখানে সংরক্ষিত হবে।</span>
        </div>
      ) : (
        <>
          <div className="nailed-screen-summary">
            <span className="nailed-screen-total">{total}</span>
            <span className="nailed-screen-total-label">
              টি প্রশ্ন {groups.length}টি টপিকে Nailed
            </span>
          </div>
          <div className="nailed-screen-hint">
            <X size={11} style={{display:'inline',verticalAlign:'middle'}} />
            চাপুন un-nail করতে — প্রশ্নটি আবার কুইজ পুলে ফিরে যাবে।
          </div>
          <div className="nailed-screen-list">
            {groups.map(g => (
              <NailedGroup key={g.cat} group={g} unnail={unnail} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function NailedGroup({ group, unnail }) {
  const [open, setOpen] = useState(true)
  const { cat, color, items } = group

  return (
    <div className="nailed-group">
      <button className="nailed-group-header" onClick={() => setOpen(v => !v)}>
        <div className="nailed-group-label">
          <span className="nailed-group-dot" style={{background: color}} />
          <span style={{color}}>{cat}</span>
          <span className="nailed-group-badge" style={{background:`${color}20`, color}}>
            {items.length}
          </span>
        </div>
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      {open && (
        <div className="nailed-group-body anim-slide">
          {items.map(({ qid, question, correctOpt, correctKey }) => (
            <div key={qid} className="nailed-row">
              <Star size={11} fill="currentColor" style={{color:'#f59e0b', flexShrink:0, marginTop:3}} />
              <div className="nailed-row-body">
                <span className="nailed-row-text" style={{fontFamily:"'Noto Serif Bengali',serif"}}>{question}</span>
                <div className="nailed-row-answer">
                  <span className="nailed-ans-key">{correctKey}</span>
                  <span className="nailed-ans-text" style={{fontFamily:"'Noto Sans Bengali','Inter',sans-serif"}}>{correctOpt}</span>
                </div>
              </div>
              <button
                className="nailed-unnail-btn"
                onClick={() => unnail(qid)}
                title="Un-nail — কুইজ পুলে ফিরিয়ে দাও"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
