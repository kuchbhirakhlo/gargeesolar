'use client';

import { useLanguage } from '@/lib/language-context';
import { Check, Sun, Target, Eye, Shield, Award, Users, Zap } from 'lucide-react';
import Image from 'next/image';

export function AboutSection() {
  const { t } = useLanguage();

  const features = [
    { icon: Shield, title: t.about.features.expert.title, desc: t.about.features.expert.desc },
    { icon: Award, title: t.about.features.quality.title, desc: t.about.features.quality.desc },
    { icon: Users, title: t.about.features.support.title, desc: t.about.features.support.desc },
    { icon: Zap, title: t.about.features.custom.title, desc: t.about.features.custom.desc },
  ];

  const stats = [
    { value: '500+', label: t.about.stats.projects },
    { value: '2000+', label: t.about.stats.customers },
    { value: '10+', label: t.about.stats.years },
    { value: '50+', label: t.about.stats.cities },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary">{t.about.title}</h2>
          <div className="w-20 h-1 bg-secondary mx-auto rounded-full" />
        </div>

        {/* Big Hero Image */}
        <div className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden mb-16 shadow-xl">
          <Image
            src="/homesolar.png"
            alt="Gargee Solar - Solar Panel Installation"
            fill
            className="object-cover"
            priority
            suppressHydrationWarning
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <h3 className="text-white text-2xl md:text-4xl font-bold mb-2">Powering a Greener Tomorrow</h3>
            <p className="text-white/80 text-sm md:text-lg max-w-2xl">
              Leading the solar energy revolution in Uttar Pradesh with quality installations and unmatched service
            </p>
          </div>
        </div>

        {/* About Description + Mission/Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left - Description */}
          <div className="space-y-6">
            <p className="text-lg text-foreground/80 leading-relaxed">
              {t.about.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <Check className="w-4 h-4 text-secondary" />
                MNRE Certified
              </div>
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <Check className="w-4 h-4 text-secondary" />
                ISO Standards
              </div>
              <div className="flex items-center gap-2 text-sm text-primary font-medium">
                <Check className="w-4 h-4 text-secondary" />
                Govt. Empaneled
              </div>
            </div>
          </div>

          {/* Right - Mission & Vision Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/10">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">{t.about.mission}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">
                {t.about.missionText}
              </p>
            </div>
            <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl p-6 border border-secondary/10">
              <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">{t.about.vision}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">
                {t.about.visionText}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Counter */}
        <div className="bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-8 md:p-12 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-white">{stat.value}</div>
                <div className="text-blue-200 text-sm md:text-base font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="text-center space-y-4 mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-primary">{t.about.whyUs}</h3>
          <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-xl p-6 border border-gray-100 hover:border-secondary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                    <Icon className="w-7 h-7 text-secondary" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-primary">{feature.title}</h4>
                    <p className="text-foreground/70 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}