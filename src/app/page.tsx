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
    <div className="min-h-screen relative z-10">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-card" style={{ borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.3)" }}>
              <ClipboardList className="w-4 h-4 text-cyan" />
            </div>
            <span className="font-semibold text-[13px] tracking-[0.15em] uppercase text-txt-primary">ClientBrief</span>
          </div>
          <Link href="/dashboard" className="btn-primary text-[13px]">
            Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: "rgba(6,182,212,0.08)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px]" style={{ background: "rgba(139,92,246,0.06)" }} />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-medium mb-8 animate-fade-in" style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)", color: "#06B6D4" }}>
            <Sparkles className="w-3.5 h-3.5" />
            Fini le chaos des mails et WhatsApp
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-txt-primary mb-6 animate-slide-up leading-[1.1]">
            Collectez le contenu client{" "}
            <span style={{ background: "linear-gradient(135deg, #06B6D4, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              en 10 minutes
            </span>
          </h1>

          <p className="text-[16px] text-txt-secondary max-w-2xl mx-auto mb-10 animate-slide-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
            Générez un lien unique, votre client remplit un wizard guidé, vous
            recevez un JSON structuré prêt à injecter dans vos templates Next.js.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link href="/dashboard" className="btn-primary !px-8 !py-3 text-[14px]">
              Créer mon premier brief
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-txt-primary">
            Comment ça marche
          </h2>
          <p className="text-txt-muted text-center mb-16 text-[14px]">
            3 étapes, zéro friction
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Link2,
                step: "01",
                title: "Créez un brief",
                desc: "Renseignez le nom du client et son email. Un lien unique est généré automatiquement.",
                color: "#06B6D4",
              },
              {
                icon: ClipboardList,
                step: "02",
                title: "Le client remplit",
                desc: "Un wizard guidé et intuitif : infos, couleurs, textes, photos, réseaux sociaux. Tout y est.",
                color: "#8B5CF6",
              },
              {
                icon: FileJson2,
                step: "03",
                title: "Exportez le JSON",
                desc: "Récupérez un JSON structuré, prêt à injecter dans votre template Next.js. Copié, collé, déployé.",
                color: "#10B981",
              },
            ].map((item) => (
              <div key={item.step} className="glass-card p-8 group cursor-pointer transition-all duration-200 hover:border-[rgba(6,182,212,0.3)]">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${item.color}20`, border: `1px solid ${item.color}40`, boxShadow: `0 0 20px ${item.color}15` }}>
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div className="text-[11px] font-mono text-txt-muted mb-2">{item.step}</div>
                <h3 className="text-[16px] font-semibold text-txt-primary mb-3">{item.title}</h3>
                <p className="text-txt-secondary text-[13px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-16 text-txt-primary">
            Tout ce qu&apos;il faut, rien de plus
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Sparkles, title: "Génération IA", desc: "Le client est flou ? L'IA génère les textes manquants à partir du contexte.", color: "#06B6D4" },
              { icon: FileJson2, title: "Export JSON", desc: "Structure prête pour vos composants Next.js. Zéro formatage manuel.", color: "#8B5CF6" },
              { icon: Link2, title: "Lien unique", desc: "Un token sécurisé par client, partageable par mail ou WhatsApp.", color: "#10B981" },
              { icon: Zap, title: "Wizard guidé", desc: "Étape par étape, le client ne peut pas se perdre. UX pensée pour les non-tech.", color: "#F59E0B" },
              { icon: Shield, title: "Upload photos", desc: "Logo, hero, galerie — tout est collecté et organisé au même endroit.", color: "#EF4444" },
              { icon: ClipboardList, title: "Dashboard pro", desc: "Suivez l'avancement de chaque brief en un coup d'œil.", color: "#06B6D4" },
            ].map((f) => (
              <div key={f.title} className="glass-card p-6 transition-all duration-200 hover:border-[rgba(6,182,212,0.3)] cursor-pointer group">
                <f.icon className="w-5 h-5 mb-4 transition-all duration-200 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" style={{ color: f.color }} />
                <h3 className="font-semibold text-[14px] text-txt-primary mb-2">{f.title}</h3>
                <p className="text-txt-secondary text-[12px] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card-glow p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-txt-primary">
              Prêt à professionnaliser votre onboarding ?
            </h2>
            <p className="text-txt-secondary text-[14px] mb-10">
              Divisez par 3 votre temps de collecte de contenu.
            </p>
            <Link href="/dashboard" className="btn-primary !px-10 !py-3 text-[14px]">
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 relative z-10" style={{ borderTop: "1px solid rgba(6,182,212,0.08)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[12px] text-txt-muted">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "rgba(6,182,212,0.15)" }}>
              <ClipboardList className="w-3 h-3 text-cyan" />
            </div>
            <span className="font-semibold text-txt-secondary tracking-[0.1em] uppercase text-[11px]">ClientBrief</span>
          </div>
          <span>
            Propulsé par{" "}
            <a href="https://irya.fr" target="_blank" rel="noopener noreferrer" className="text-cyan hover:underline font-medium">
              IRYA
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
