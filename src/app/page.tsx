"use client";

import Link from "next/link";
import {
  ArrowRight,
  FileJson2,
  Link2,
  Sparkles,
  ClipboardList,
  Zap,
  Shield,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg">ClientBrief</span>
          </div>
          <Link href="/dashboard" className="btn-primary text-sm !py-2 !px-4">
            Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-blue-50/50" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-brand-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-200/20 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            Fini le chaos des mails et WhatsApp
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold text-surface-950 mb-6 animate-slide-up leading-[1.1]">
            Collectez le contenu client{" "}
            <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
              en 10 minutes
            </span>
          </h1>

          <p
            className="text-xl text-surface-500 max-w-2xl mx-auto mb-10 animate-slide-up font-light leading-relaxed"
            style={{ animationDelay: "0.1s" }}
          >
            Générez un lien unique, votre client remplit un wizard guidé, vous
            recevez un JSON structuré prêt à injecter dans vos templates Next.js.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Link href="/dashboard" className="btn-primary text-base !px-8 !py-4">
              Créer mon premier brief
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
            Comment ça marche
          </h2>
          <p className="text-surface-500 text-center mb-16 text-lg">
            3 étapes, zéro friction
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Link2,
                step: "01",
                title: "Créez un brief",
                desc: "Renseignez le nom du client et son email. Un lien unique est généré automatiquement.",
                color: "from-brand-500 to-brand-600",
              },
              {
                icon: ClipboardList,
                step: "02",
                title: "Le client remplit",
                desc: "Un wizard guidé et intuitif : infos, couleurs, textes, photos, réseaux sociaux. Tout y est.",
                color: "from-indigo-500 to-indigo-600",
              },
              {
                icon: FileJson2,
                step: "03",
                title: "Exportez le JSON",
                desc: "Récupérez un JSON structuré, prêt à injecter dans votre template Next.js. Copié, collé, déployé.",
                color: "from-violet-500 to-violet-600",
              },
            ].map((item) => (
              <div key={item.step} className="card p-8 group">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm font-mono text-surface-400 mb-2">
                  {item.step}
                </div>
                <h3 className="text-xl font-display font-bold mb-3">
                  {item.title}
                </h3>
                <p className="text-surface-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-surface-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(12,147,231,0.15),transparent_60%)]" />
        <div className="max-w-6xl mx-auto relative">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16">
            Tout ce qu&apos;il faut, rien de plus
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: "Génération IA",
                desc: "Le client est flou ? L'IA génère les textes manquants à partir du contexte.",
              },
              {
                icon: FileJson2,
                title: "Export JSON",
                desc: "Structure prête pour vos composants Next.js. Zéro formatage manuel.",
              },
              {
                icon: Link2,
                title: "Lien unique",
                desc: "Un token sécurisé par client, partageable par mail ou WhatsApp.",
              },
              {
                icon: Zap,
                title: "Wizard guidé",
                desc: "Étape par étape, le client ne peut pas se perdre. UX pensée pour les non-tech.",
              },
              {
                icon: Shield,
                title: "Upload photos",
                desc: "Logo, hero, galerie — tout est collecté et organisé au même endroit.",
              },
              {
                icon: ClipboardList,
                title: "Dashboard pro",
                desc: "Suivez l'avancement de chaque brief en un coup d'œil.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300"
              >
                <f.icon className="w-6 h-6 text-brand-400 mb-4" />
                <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-surface-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Prêt à professionnaliser votre onboarding ?
          </h2>
          <p className="text-surface-500 text-lg mb-10">
            Divisez par 3 votre temps de collecte de contenu.
          </p>
          <Link href="/dashboard" className="btn-primary text-lg !px-10 !py-4">
            Commencer maintenant
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-surface-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-surface-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center">
              <ClipboardList className="w-3 h-3 text-white" />
            </div>
            <span className="font-display font-semibold text-surface-600">
              ClientBrief
            </span>
          </div>
          <span>
            Propulsé par{" "}
            <a
              href="https://irya.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline font-medium"
            >
              IRYA
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
