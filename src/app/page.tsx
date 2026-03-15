"use client";

import Link from "next/link";
import { ArrowRight, FileJson2, Link2, Sparkles, ClipboardList, Zap, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 glass-card" style={{ borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ice-400 to-ice-600 flex items-center justify-center shadow-md shadow-ice-400/20">
              <ClipboardList className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[13px] sm:text-[14px] tracking-wide text-txt-primary">ClientBrief</span>
          </div>
          <Link href="/dashboard" className="btn-primary text-[12px] sm:text-[13px] !px-4 !py-2 sm:!px-5 sm:!py-2.5">Dashboard <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 relative">
        <div className="absolute top-10 right-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full blur-[80px] sm:blur-[100px] bg-ice-200/40" />
        <div className="absolute bottom-0 left-0 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] rounded-full blur-[80px] sm:blur-[100px] bg-ice-300/30" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-[12px] font-medium mb-6 sm:mb-8 animate-fade-in bg-ice-100/60 text-ice-600 border border-ice-200/50">
            <Sparkles className="w-3.5 h-3.5" /> Fini le chaos des mails et WhatsApp
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 animate-slide-up leading-[1.1]">
            Collectez le contenu client{" "}
            <span className="bg-gradient-to-r from-ice-500 to-ice-700 bg-clip-text text-transparent">en 10 minutes</span>
          </h1>
          <p className="text-[14px] sm:text-[16px] text-txt-secondary max-w-2xl mx-auto mb-8 sm:mb-10 animate-slide-up leading-relaxed px-2" style={{ animationDelay: "0.1s" }}>
            Générez un lien unique, votre client remplit un wizard guidé, vous recevez un JSON structuré prêt à injecter.
          </p>
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link href="/dashboard" className="btn-primary !px-6 sm:!px-8 !py-3 text-[13px] sm:text-[14px] w-full sm:w-auto">Créer mon premier brief <ArrowRight className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-3 sm:mb-4">Comment ça marche</h2>
          <p className="text-txt-muted text-center mb-10 sm:mb-16 text-[13px] sm:text-[14px]">3 étapes, zéro friction</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Link2, step: "01", title: "Créez un brief", desc: "Renseignez le nom du client et son email. Un lien unique est généré.", color: "from-ice-400 to-ice-500" },
              { icon: ClipboardList, step: "02", title: "Le client remplit", desc: "Un wizard guidé : infos, couleurs, textes, photos, réseaux sociaux.", color: "from-ice-500 to-ice-600" },
              { icon: FileJson2, step: "03", title: "Exportez le JSON", desc: "JSON structuré prêt à injecter dans votre template Next.js.", color: "from-ice-600 to-ice-700" },
            ].map((item) => (
              <div key={item.step} className="glass-card p-6 sm:p-8 group">
                <div className={`w-11 sm:w-12 h-11 sm:h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-ice-400/15`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-[11px] font-mono text-txt-muted mb-2">{item.step}</div>
                <h3 className="text-[15px] sm:text-[16px] font-semibold mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-txt-secondary text-[12px] sm:text-[13px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-10 sm:mb-16">Tout ce qu&apos;il faut</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: Sparkles, title: "Génération IA", desc: "L'IA génère les textes manquants." },
              { icon: FileJson2, title: "Export JSON", desc: "Structure prête pour Next.js." },
              { icon: Link2, title: "Lien unique", desc: "Un token sécurisé par client." },
              { icon: Zap, title: "Wizard guidé", desc: "UX pensée pour les non-tech." },
              { icon: Shield, title: "Upload photos", desc: "Tout collecté au même endroit." },
              { icon: ClipboardList, title: "Dashboard pro", desc: "Chaque brief en un coup d'oeil." },
            ].map((f) => (
              <div key={f.title} className="glass-card p-4 sm:p-6 group">
                <f.icon className="w-5 h-5 mb-3 sm:mb-4 text-ice-500" />
                <h3 className="font-semibold text-[13px] sm:text-[14px] mb-1 sm:mb-2">{f.title}</h3>
                <p className="text-txt-secondary text-[11px] sm:text-[12px] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card-glow p-8 sm:p-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Prêt à professionnaliser votre onboarding ?</h2>
            <p className="text-txt-secondary text-[13px] sm:text-[14px] mb-8 sm:mb-10">Divisez par 3 votre temps de collecte.</p>
            <Link href="/dashboard" className="btn-primary !px-8 sm:!px-10 !py-3 text-[13px] sm:text-[14px] w-full sm:w-auto">Commencer <ArrowRight className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-ice-100/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px] sm:text-[12px] text-txt-muted">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-ice-400 to-ice-600 flex items-center justify-center"><ClipboardList className="w-3 h-3 text-white" /></div>
            <span className="font-semibold text-txt-secondary">ClientBrief</span>
          </div>
          <span>Propulsé par <a href="https://irya.fr" target="_blank" rel="noopener noreferrer" className="text-ice-600 hover:underline font-medium">IRYA</a></span>
        </div>
      </footer>
    </div>
  );
}
