import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: "À propos — Gwen, animateur multi-diplômé",
  description: "Animateur événementiel à Libourne depuis 10 ans. BAFD, BAFA, 3e Dan Viet Vo Dao, PSE1/PSE2/PSC1.",
}

const DIPLOMES = [
  { e: '🎓', n: 'BAFA', d: 'Brevet d\'Aptitude aux Fonctions d\'Animateur' },
  { e: '🎓', n: 'BAFD', d: 'Direction d\'accueils collectifs de mineurs' },
  { e: '🥋', n: '3e Dan Viet Vo Dao', d: 'Professeur fédéral d\'arts martiaux' },
  { e: '🚑', n: 'PSC1', d: 'Premiers secours civiques' },
  { e: '🚑', n: 'PSE1 / PSE2', d: 'Premiers secours en équipe' },
  { e: '🎯', n: 'DEJEPS KDA', d: "Diplôme d'État Karaté & Disciplines Associées (en cours)" },
]

export default function AboutPage() {
  return (
    <>
      <section className="bg-aa-cream py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[1.3fr_1fr] md:items-center md:px-8">
          <div>
            <span className="nb-pill">👋 Hello !</span>
            <h1 className="mt-6 font-display uppercase leading-[0.95]" style={{ fontSize: 'clamp(44px, 7vw, 84px)' }}>
              Bonjour, moi c'est <span className="accent-red">Gwen</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-aa-ink/80">
              Animateur professionnel depuis 10 ans, ancien directeur d'ALSH, prof de Viet Vo Dao —
              j'ai créé AnimAction33 pour proposer ce que je cherchais en vain pour mes propres événements :
              de l'anim qui prend tout en main et qui en a sous le capot.
            </p>
            <Link href="/contact" className="nb-btn nb-btn--red mt-8 inline-flex">
              Parlons de votre événement
            </Link>
          </div>
          <div className="relative">
            <Image
              src="/mascot-only.png"
              alt="Mascotte"
              width={420}
              height={420}
              className="mx-auto h-72 w-auto animate-float drop-shadow-xl md:h-96"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto grid max-w-5xl gap-8 px-5 md:grid-cols-2 md:px-8">
          <div className="rounded-md border-[3px] border-aa-ink bg-aa-cream p-6 shadow-pop">
            <div className="text-5xl">😩</div>
            <h2 className="mt-3 font-display text-2xl uppercase">Le problème</h2>
            <p className="mt-2 text-aa-ink/80">
              Animateurs qui débitent leur formule, matériel rapiécé, scénarios génériques —
              les enfants s'ennuient, les parents font la grimace.
            </p>
          </div>
          <div className="rounded-md border-[3px] border-aa-ink bg-aa-yellow p-6 shadow-pop">
            <div className="text-5xl">🚀</div>
            <h2 className="mt-3 font-display text-2xl uppercase">La solution AnimAction33</h2>
            <p className="mt-2 text-aa-ink/80">
              Un animateur diplômé, des scénarios cousus main, du matériel pro,
              une vraie présence dans la salle. On reste pro — vous restez fun.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-aa-cream py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <h2 className="text-center font-display uppercase text-3xl md:text-4xl">Diplômes & qualifications</h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {DIPLOMES.map((d, i) => (
              <article key={i} className="nb-card p-5">
                <div className="text-4xl">{d.e}</div>
                <h3 className="mt-3 font-display text-lg uppercase">{d.n}</h3>
                <p className="mt-1 text-sm text-aa-ink/70">{d.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
