import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, Fingerprint, UsersRound, BriefcaseBusiness, CalendarDays, Clock3, CircleCheck, ChevronDown, Sparkles, LayoutDashboard, Search, Bell, LogOut } from 'lucide-react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

function Brand() {
  return <div className="brand"><span className="brand-mark"><Fingerprint size={21} /></span><span>people<span className="brand-dot">.</span>desk</span></div>
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, remember }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'We couldn’t sign you in. Check your details and try again.')
      if (!data.user || !['admin', 'employee'].includes(data.user.role)) throw new Error('This account does not have access to PeopleDesk.')
      onLogin(data.user, remember ? { token: data.token, expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 } : null)
    } catch (loginError) {
      setError(loginError.message === 'Failed to fetch' ? 'Can’t reach the sign-in service. Please try again in a moment.' : loginError.message)
    } finally {
      setLoading(false)
    }
  }

  return <main className="auth-page">
    <section className="auth-card" aria-labelledby="login-title">
      <p className="auth-eyebrow">Please enter your details</p>
      <h1 id="login-title">Welcome back</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="email">Email address</label>
        <input className="auth-input" id="email" type="email" placeholder="Email address" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <label className="sr-only" htmlFor="password">Password</label>
        <div className="auth-password"><input className="auth-input" id="password" type={showPassword ? 'text' : 'password'} placeholder="Password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /><button className="auth-show-password" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        <div className="auth-options"><label className="auth-remember"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /><span>Remember for 30 days</span></label><a href="mailto:help@peopledesk.example?subject=Password%20help">Forgot password?</a></div>
        {error && <div className="login-error" role="alert">{error}</div>}
        <button className="auth-submit" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <p className="auth-signup">Don’t have an account? <a href="mailto:help@peopledesk.example?subject=PeopleDesk%20account">Contact your administrator</a></p>
    </section>
  </main>
}

const employees = [
  { initials: 'AM', name: 'Aarav Mehta', role: 'Product Designer', team: 'Design', status: 'Present', color: 'av-a' },
  { initials: 'SJ', name: 'Sana Joshi', role: 'Engineering Lead', team: 'Engineering', status: 'Present', color: 'av-b' },
  { initials: 'RK', name: 'Rohan Kapoor', role: 'People Partner', team: 'People', status: 'On leave', color: 'av-c' },
  { initials: 'LT', name: 'Leah Thomas', role: 'Product Manager', team: 'Product', status: 'Present', color: 'av-d' },
]

function Dashboard({ user, onLogout }) {
  const isAdmin = user.role === 'admin'
  const firstName = user.name?.split(' ')[0] || (isAdmin ? 'Admin' : 'there')
  const now = new Date()
  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(now).toUpperCase()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening'
  const [activeNav, setActiveNav] = useState('Overview')
  const links = isAdmin ? ['Overview', 'Employees', 'Attendance', 'Time off', 'Departments'] : ['Overview', 'My profile', 'Attendance', 'Time off']
  return <div className="dashboard-shell"><aside className="dashboard-sidebar"><Brand /><div className="workspace-label">WORKSPACE</div><nav>{links.map((item, index) => <button key={item} onClick={() => setActiveNav(item)} className={`nav-link ${activeNav === item ? 'active' : ''}`}><span className="nav-icon">{[<LayoutDashboard size={17} />, <UsersRound size={17} />, <Clock3 size={17} />, <CalendarDays size={17} />, <BriefcaseBusiness size={17} />][index]}</span>{item}{item === 'Time off' && <span className="nav-badge">2</span>}</button>)}</nav><div className="sidebar-spacer" /><div className="help-card"><Sparkles size={17} /><strong>Need a hand?</strong><span>We’re just a message away.</span><button onClick={() => window.location.href = 'mailto:help@peopledesk.example'}>Get support <ArrowRight size={14} /></button></div><button className="sidebar-user" onClick={onLogout}><span className="user-avatar">{user.name?.split(' ').map((n) => n[0]).slice(0, 2).join('') || 'PD'}</span><span className="user-meta"><strong>{user.name}</strong><small>{user.role === 'admin' ? 'Administrator' : 'Team member'}</small></span><LogOut size={16} /></button></aside>
    <main className="dashboard-main"><header className="dashboard-header"><div className="breadcrumb">Workspace <span>/</span> <strong>{activeNav}</strong></div><div className="header-actions"><button className="search-button"><Search size={17} /><span>Search</span><kbd>⌘ K</kbd></button><button className="bell-button" aria-label="Notifications"><Bell size={18} /><i /></button><button className="header-user" onClick={onLogout}><span className="user-avatar">{user.name?.split(' ').map((n) => n[0]).slice(0, 2).join('') || 'PD'}</span><ChevronDown size={15} /></button></div></header>
      <section className="dashboard-content"><div className="greeting-row"><div><div className="date-line"><CalendarDays size={14} /> {today}</div><h1>{greeting}, {firstName}<span className="wave">✳</span></h1><p>Here’s what’s happening with your team today.</p></div><button className="date-picker"><CalendarDays size={16} /> This week <ChevronDown size={15} /></button></div>
      <div className="stat-grid"><div className="stat-card"><span className="stat-label">TOTAL EMPLOYEES</span><div className="stat-value">128 <span className="stat-change">↗ 8.2%</span></div><span className="stat-note">Compared to last month</span><div className="stat-icon icon-indigo"><UsersRound size={18} /></div><div className="sparkline">{Array.from({length:12},(_,i)=><i key={i}/>)}</div></div><div className="stat-card"><span className="stat-label">PRESENT TODAY</span><div className="stat-value">112 <span className="stat-caption">of 128</span></div><span className="stat-note">87.5% attendance</span><div className="stat-icon icon-mint"><CircleCheck size={18} /></div><div className="progress-track"><span /></div></div><div className="stat-card"><span className="stat-label">ON LEAVE</span><div className="stat-value">08 <span className="stat-caption">people</span></div><span className="stat-note">Across 4 departments</span><div className="stat-icon icon-amber"><CalendarDays size={18} /></div><div className="mini-avatars"><i>AM</i><i>RK</i><i>+6</i></div></div><div className="stat-card"><span className="stat-label">OPEN POSITIONS</span><div className="stat-value">06 <span className="stat-change">↗ 2 new</span></div><span className="stat-note">Across 3 departments</span><div className="stat-icon icon-rose"><BriefcaseBusiness size={18} /></div><div className="job-pills"><i/><i/><i/><i/><i/><i/></div></div></div>
      <div className="dashboard-lower"><section className="panel employee-panel"><div className="panel-heading"><div><h2>{isAdmin ? 'Your people' : 'Your team'}</h2><p>{isAdmin ? 'A snapshot of your growing team' : 'People you work with every day'}</p></div><button className="text-link" onClick={() => setActiveNav(isAdmin ? 'Employees' : 'My profile')}>{isAdmin ? 'All employees' : 'View team'} <ArrowRight size={14} /></button></div><div className="table-head"><span>EMPLOYEE</span><span>DEPARTMENT</span><span>STATUS</span></div>{employees.slice(0, isAdmin ? 4 : 3).map(person => <div className="employee-row" key={person.name}><span className={`employee-avatar ${person.color}`}>{person.initials}</span><span className="employee-name"><strong>{person.name}</strong><small>{person.role}</small></span><span className="employee-team">{person.team}</span><span className={`status-pill ${person.status === 'Present' ? 'status-present' : 'status-leave'}`}><i />{person.status}</span></div>)}</section>
      <section className="panel activity-panel"><div className="panel-heading"><div><h2>Today’s activity</h2><p>The latest from your workspace</p></div><button className="more-button">···</button></div><div className="activity-item"><span className="activity-icon activity-blue"><UsersRound size={15} /></span><div><strong>New team member</strong><p>Priya Sharma joined <b>Design</b></p><small>09:42 AM</small></div></div><div className="activity-item"><span className="activity-icon activity-orange"><CalendarDays size={15} /></span><div><strong>Time off requested</strong><p>Rohan requested leave for <b>Nov 4–6</b></p><small>09:18 AM</small></div></div><div className="activity-item"><span className="activity-icon activity-green"><Clock3 size={15} /></span><div><strong>Attendance updated</strong><p>Your team check-in is <b>looking good</b></p><small>08:56 AM</small></div></div><button className="activity-link">View all activity <ArrowRight size={14} /></button></section></div><div className="dashboard-note"><span><Sparkles size={15} /> You’re all caught up.</span><span>Have a great day, {firstName}!</span></div></section></main></div>
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem('emsSession'))
      if (session?.token && session?.user && session.expiresAt > Date.now()) return session.user
    } catch {}
    localStorage.removeItem('emsSession')
    return null
  })
  function login(nextUser, rememberedSession) {
    if (rememberedSession) localStorage.setItem('emsSession', JSON.stringify({ ...rememberedSession, user: nextUser }))
    else localStorage.removeItem('emsSession')
    setUser(nextUser)
  }
  function logout() { localStorage.removeItem('emsSession'); setUser(null) }
  return user ? <Dashboard user={user} onLogout={logout} /> : <Login onLogin={login} />
}

export default App
