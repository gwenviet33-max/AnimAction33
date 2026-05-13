'use client'

import { useEffect, useState } from 'react'
import { aaStore, STORE_DEFAULTS } from '@/lib/store'
import type { BlogPost } from '@/lib/defaults'
import { showToast } from '@/lib/utils'

type BlogData = (typeof STORE_DEFAULTS)['blog']

const emptyPost = (): BlogPost => ({
  slug: 'nouveau-article-' + Math.random().toString(36).slice(2, 7),
  title: 'Nouvel article',
  intro: '',
  body: '',
  published: false,
  date: new Date().toISOString(),
})

export default function BlogAdmin() {
  const [data, setData] = useState<BlogData>(STORE_DEFAULTS.blog)
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  useEffect(() => {
    aaStore.get('blog').then(setData)
  }, [])

  const update = (next: BlogData) => {
    setData(next)
  }

  const save = async () => {
    const ok = await aaStore.flush('blog', data)
    showToast(ok ? '💾 Blog sauvegardé' : '⚠️ Erreur de sauvegarde')
  }

  const toggleGlobal = (enabled: boolean) => {
    update({ ...data, enabled })
  }

  const addPost = () => {
    update({ ...data, posts: [emptyPost(), ...data.posts] })
    setOpenIdx(0)
  }

  const updatePost = (idx: number, patch: Partial<BlogPost>) => {
    update({
      ...data,
      posts: data.posts.map((p, i) => (i === idx ? { ...p, ...patch } : p)),
    })
  }

  const deletePost = (idx: number) => {
    if (!confirm('Supprimer cet article ?')) return
    update({ ...data, posts: data.posts.filter((_, i) => i !== idx) })
  }

  const visibleCount = data.posts.filter((p) => p.published).length

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl uppercase md:text-4xl">Blog</h1>
      <p className="mt-1 text-aa-ink/70">
        Active ou désactive le blog complet (page <code>/blog</code>), gère les articles et leur
        statut de publication.
      </p>

      <div className="mt-6 rounded-md border-[3px] border-aa-ink bg-aa-paper p-5 shadow-pop">
        <label className="flex items-center justify-between gap-3">
          <div>
            <div className="font-display text-lg uppercase">
              {data.enabled ? '✅ Blog actif' : '⏸ Blog désactivé'}
            </div>
            <p className="mt-1 text-sm text-aa-ink/70">
              {data.enabled
                ? `Le blog est visible publiquement. ${visibleCount} article(s) publié(s) sur ${data.posts.length}.`
                : "Le blog n'apparaît pas dans le menu et /blog renvoie 404. Active-le quand tu auras du contenu publié."}
            </p>
          </div>
          <input
            type="checkbox"
            checked={data.enabled}
            onChange={(e) => toggleGlobal(e.target.checked)}
            className="h-7 w-7 shrink-0"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl uppercase">Articles</h2>
        <button onClick={addPost} className="nb-btn nb-btn--blue">
          + Nouvel article
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {data.posts.length === 0 && (
          <p className="rounded-md border-2 border-dashed border-aa-ink/30 p-6 text-center text-aa-ink/60">
            Aucun article. Clique sur « Nouvel article » pour commencer.
          </p>
        )}

        {data.posts.map((p, i) => {
          const isOpen = openIdx === i
          return (
            <article key={i} className="rounded-md border-[3px] border-aa-ink bg-aa-paper shadow-pop">
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="flex w-full items-center gap-3 px-5 py-3 text-left"
              >
                <span
                  className={
                    'rounded-full border-2 border-aa-ink px-2 py-0.5 text-xs font-bold ' +
                    (p.published ? 'bg-aa-blue text-white' : 'bg-white text-aa-ink/60')
                  }
                >
                  {p.published ? 'Publié' : 'Brouillon'}
                </span>
                <span className="flex-1 truncate font-display uppercase">{p.title || '—'}</span>
                <span className="text-xs text-aa-ink/50">{isOpen ? '▴' : '▾'}</span>
              </button>

              {isOpen && (
                <div className="space-y-3 border-t-2 border-aa-ink/10 p-5">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-bold uppercase">Titre</span>
                      <input
                        type="text"
                        value={p.title}
                        onChange={(e) => updatePost(i, { title: e.target.value })}
                        className="mt-1 w-full rounded-md border-2 border-aa-ink bg-white p-2"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold uppercase">Slug (URL)</span>
                      <input
                        type="text"
                        value={p.slug}
                        onChange={(e) =>
                          updatePost(i, {
                            slug: e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]+/g, '-')
                              .replace(/-+/g, '-')
                              .replace(/^-|-$/g, ''),
                          })
                        }
                        className="mt-1 w-full rounded-md border-2 border-aa-ink bg-white p-2 font-mono text-sm"
                      />
                      <span className="mt-1 block text-xs text-aa-ink/50">
                        /blog/<b>{p.slug || '...'}</b>
                      </span>
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-xs font-bold uppercase">Intro</span>
                    <textarea
                      value={p.intro}
                      onChange={(e) => updatePost(i, { intro: e.target.value })}
                      rows={2}
                      className="mt-1 w-full rounded-md border-2 border-aa-ink bg-white p-2"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-bold uppercase">
                      Corps (sépare les paragraphes par une ligne vide)
                    </span>
                    <textarea
                      value={p.body}
                      onChange={(e) => updatePost(i, { body: e.target.value })}
                      rows={10}
                      className="mt-1 w-full rounded-md border-2 border-aa-ink bg-white p-2 text-sm"
                    />
                  </label>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={p.published}
                        onChange={(e) => updatePost(i, { published: e.target.checked })}
                      />
                      <span className="text-sm font-bold">Publier cet article</span>
                    </label>
                    <button
                      onClick={() => deletePost(i)}
                      className="rounded-full border-2 border-aa-ink bg-aa-red px-3 py-1 text-xs font-bold text-white"
                    >
                      🗑 Supprimer
                    </button>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button onClick={save} className="nb-btn nb-btn--red">
          💾 Enregistrer le blog
        </button>
      </div>

      <div className="mt-6 rounded-md border-[3px] border-aa-ink bg-aa-cream p-5">
        <h3 className="font-display uppercase">💡 Conseils</h3>
        <ul className="mt-2 list-disc pl-5 text-sm text-aa-ink/80">
          <li>Tant que le toggle global est <b>désactivé</b>, /blog renvoie 404 et le lien disparaît du footer.</li>
          <li>Un article en <b>brouillon</b> n&apos;est pas accessible publiquement, même si le blog est activé.</li>
          <li>Le <b>slug</b> est l&apos;URL : <code>/blog/{'<slug>'}</code>. Ne change pas le slug d&apos;un article déjà publié, sinon tu casses les liens et Google.</li>
          <li>Sépare les paragraphes du corps avec une <b>ligne vide</b>.</li>
          <li>N&apos;oublie pas <b>💾 Enregistrer le blog</b> en bas après tes modifs.</li>
        </ul>
      </div>
    </div>
  )
}
