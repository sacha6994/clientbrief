"use client";

import Link from "next/link";
import { ArrowRight, FileJson2, Link2, Sparkles, ClipboardList, Zap, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-card" style={{ borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ice-400 to-ice-600 flex items-center justify-center shadow-md shadow-ice-400/20">
              <ClipboardList className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[14px] tracking-wide text-txt-primary">ClientBrief</span>
          </div>
          <Link href="/dashboard" className="btn-primary text-[13px]">Dashboard <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute top-10 right-10 w-[400px] h-[400px] rounded-full blur-[100px] bg-ice-200/40" />
        <div className="absolute bottom-0 left-10 w-[300px] h-[300px] rounded-full blur-[100px] bg-ice-300/30" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-medium mb-8 animate-fade-in bg-ice-100/60 text-ice-600 border border-ice-200/50">
            <Sparkles className="w-3.5 h-3.5" /> Fini le chaos des mails et WhatsApp
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up leading-[1.1]">
            Collectez le contenu client{" "}
            <span className="bg-gradient-to-r from-ice-500 to-ice-700 bg-clip-text text-transparent">en 10 minutes</span>
          </h1>
          <p className="text-[16px] text-txt-secondary max-w-2xl mx-auto mb-10 animate-slide-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
            Générez un lien unique, votre client remplit un wizard guidé, vous recevez un JSON structuré prêt à injecter dans vos templates Next.js.
          </p>
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link href="/dashboard" className="btn-primary !px-8 !py-3 text-[14px]">Créer mon premier brief <ArrowRight className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Comment ça marche</h2>
          <p className="text-txt-muted text-center mb-16 text-[14px]">3 étapes, zéro friction</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Link2, step: "01", title: "Créez un brief", desc: "Renseignez le nom du client et son email. Un lien unique est généré automatiquement.", color: "from-ice-400 to-ice-500" },
              { icon: ClipboardList, step: "02", title: "Le client remplit", desc: "Un wizard guidé et intuitif : infos, couleurs, textes, photos, réseaux sociaux.", color: "from-ice-500 to-ice-600" },
              { icon: FileJson2, step: "03", title: "Exportez le JSON", desc: "Récupérez un JSON structuré, prêt à injecter dans votre template Next.js.", color: "from-ice-600 to-ice-700" },
            ].map((item) => (
              <div key={item.step} className="glass-card p-8 group cursor-pointer hover:shadow-lg hover:shadow-ice-300/15 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg shadow-ice-400/15 group-hover:scale-105 transition-transform`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-[11px] font-mono text-txt-muted mb-2">{item.step}</div>
                <h3 className="text-[16px] font-semibold mb-3">{item.title}</h3>
                <p className="text-txt-secondary text-[13px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-16">Tout ce qu&apos;il faut, rien de plus</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Sparkles, title: "Génération IA", desc: "Le client est flou ? L'IA génère les textes manquants." },
              { icon: FileJson2, title: "Export JSON", desc: "Structure prête pour vos composants Next.js." },
              { icon: Link2, title: "Lien unique", desc: "Un token sécurisé par client, partageable facilement." },
              { icon: Zap, title: "Wizard guidé", desc: "Le client ne peut pas se perdre. UX non-tech friendly." },
              { icon: Shield, title: "Upload photos", desc: "Logo, hero, galerie — tout collecté au même endroit." },
              { icon: ClipboardList, title: "Dashboard pro", desc: "Suivez chaque brief en un coup d'œil." },
            ].map((f) => (
              <div key={f.title} className="glass-card p-6 hover:shadow-lg hover:shadow-ice-300/10 transition-all duration-300 cursor-pointer group">
                <f.icon className="w-5 h-5 mb-4 text-ice-500 group-hover:text-ice-600 transition-colors" />
                <h3 className="font-semibold text-[14px] mb-2">{f.title}</h3>
                <p className="text-txt-secondary text-[12px] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card-glow p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Prêt à professionnaliser votre onboarding ?</h2>
            <p className="text-txt-secondary text-[14px] mb-10">Divisez par 3 votre temps de collecte de contenu.</p>
            <Link href="/dashboard" className="btn-primary !px-10 !py-3 text-[14px]">Commencer maintenant <ArrowRight className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-ice-100/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[12px] text-txt-muted">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-ice-400 to-ice-600 flex items-center justify-center">
              <ClipboardList className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-txt-secondary text-[12px]">ClientBrief</span>
          </div>
          <span>Propulsé par <a href="https://irya.fr" target="_blank" rel="noopener noreferrer" className="text-ice-600 hover:underline font-medium">IRYA</a></span>
        </div>
      </footer>
    </div>
  );
}
