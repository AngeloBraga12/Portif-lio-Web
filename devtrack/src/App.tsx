import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, BookOpen, GitFork, Github, Search, Star, Users } from 'lucide-react'

type GithubUser = {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
  bio: string | null
  followers: number
  following: number
  public_repos: number
}

type GithubRepo = {
  id: number
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  topics: string[]
}

const API = 'https://api.github.com'
const DEFAULT_USER = 'AngeloBraga12'

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API}${path}`, { headers: { Accept: 'application/vnd.github+json' } })
  if (!response.ok) throw new Error(response.status === 404 ? 'Perfil não encontrado.' : 'Não foi possível consultar a API do GitHub.')
  return response.json() as Promise<T>
}

function App() {
  const [query, setQuery] = useState(DEFAULT_USER)
  const [user, setUser] = useState<GithubUser | null>(null)
  const [repos, setRepos] = useState<GithubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProfile = async (username: string) => {
    const normalized = username.trim().replace(/^@/, '')
    if (!normalized) return
    setLoading(true); setError('')
    try {
      const [profile, repositories] = await Promise.all([
        getJson<GithubUser>(`/users/${encodeURIComponent(normalized)}`),
        getJson<GithubRepo[]>(`/users/${encodeURIComponent(normalized)}/repos?sort=updated&per_page=30`),
      ])
      setUser(profile); setRepos(repositories)
    } catch (err) {
      setUser(null); setRepos([]); setError(err instanceof Error ? err.message : 'Erro inesperado.')
    } finally { setLoading(false) }
  }

  useEffect(() => { void loadProfile(DEFAULT_USER) }, [])
  const sortedRepos = useMemo(() => [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count), [repos])
  const submit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); void loadProfile(query) }

  return (
    <main className="app-shell">
      <section className="hero"><div className="hero-inner">
        <span className="eyebrow"><Github size={16} /> DEVTRACK</span>
        <h1>Explore o trabalho de qualquer desenvolvedor.</h1>
        <p>Dashboard em React + TypeScript com consumo da API pública do GitHub, estados de carregamento, tratamento de erros e interface responsiva.</p>
        <form className="search-bar" onSubmit={submit}><Search size={20} /><input aria-label="Usuário do GitHub" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Digite um usuário do GitHub" /><button type="submit">Pesquisar</button></form>
      </div></section>
      <section className="content">
        {loading && <div className="state-card">Consultando o GitHub...</div>}
        {!loading && error && <div className="state-card error-state"><strong>Não foi possível carregar o perfil.</strong><span>{error}</span></div>}
        {!loading && user && <>
          <article className="profile-card"><img className="avatar" src={user.avatar_url} alt={`Avatar de ${user.login}`} /><div className="profile-copy">
            <div className="profile-heading"><div><span className="handle">@{user.login}</span><h2>{user.name || user.login}</h2></div><a className="external" href={user.html_url} target="_blank" rel="noreferrer">Ver GitHub <ArrowUpRight size={17} /></a></div>
            <p>{user.bio || 'Este perfil ainda não possui uma biografia pública.'}</p>
            <div className="stats"><span><BookOpen size={17} /> {user.public_repos} repositórios</span><span><Users size={17} /> {user.followers} seguidores</span><span><Users size={17} /> {user.following} seguindo</span></div>
          </div></article>
          <div className="section-title"><div><span className="eyebrow small">REPOSITÓRIOS</span><h3>Projetos em destaque</h3></div><span className="repo-count">{repos.length} encontrados</span></div>
          <div className="repo-grid">{sortedRepos.slice(0, 9).map((repo) => <a className="repo-card" key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer"><div className="repo-top"><span className="repo-name">{repo.name}</span><ArrowUpRight size={17} /></div><p>{repo.description || 'Sem descrição pública.'}</p><div className="repo-meta"><span>{repo.language || 'Código'}</span><span><Star size={15} /> {repo.stargazers_count}</span><span><GitFork size={15} /> {repo.forks_count}</span></div></a>)}</div>
        </>}
      </section>
    </main>
  )
}
export default App
