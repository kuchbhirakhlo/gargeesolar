'use client';

import { useLanguage } from '@/lib/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const ResidentialIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-primary">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const CommercialIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-primary">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
);

const MaintenanceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-primary">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const SolarPumpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-primary">
    <path d="M12 2v8" />
    <path d="M5 10h14" />
    <path d="M7 14l5 5 5-5" />
    <circle cx="12" cy="19" r="2" />
    <path d="M12 3l3 3-3 3-3-3 3-3" />
  </svg>
);

const SolarAttaChakkiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-primary">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6m-9-9h6m6 0h6" />
    <path d="M4.2 4.2l4.2 4.2m7.2 7.2l4.2 4.2M4.2 19.8l4.2-4.2m7.2-7.2l4.2-4.2" />
  </svg>
);

export function ServicesSection() {
  const { t } = useLanguage();

  const services = [
    {
      icon: <ResidentialIcon />,
      image: '/homesolar.png',
      title: t.services.items.residential.name,
      description: t.services.items.residential.description,
      features: ['Panel Installation', 'Inverter Setup', 'Wiring & Safety', 'Monitoring System'],
    },
    {
      icon: <CommercialIcon />,
      image: '/commercialsolarpanel.webp',
      title: t.services.items.commercial.name,
      description: t.services.items.commercial.description,
      features: ['Large Scale Systems', 'Roof Assessment', 'Grid Integration', 'Maintenance Plans'],
    },
    {
      icon: <MaintenanceIcon />,
      image: '/solarservices.jpeg',
      title: t.services.items.maintenance.name,
      description: t.services.items.maintenance.description,
      features: ['Regular Checks', 'Cleaning Service', 'Repairs', 'Performance Optimization'],
    },
    {
      icon: <SolarPumpIcon />,
      image: '/homesolar.png',
      title: 'Solar Pump',
      description: 'Solar-powered water pumps for irrigation and agriculture',
      features: ['DC/AC Pumps', 'Deep Well Solutions', 'Energy Efficient', 'Govt Subsidy Ready'],
    },
    {
      icon: <SolarAttaChakkiIcon />,
      image: '/commercialsolarpanel.webp',
      title: 'Solar Atta Chakki',
      description: 'Solar powered flour mills for rural and commercial use',
      features: ['5HP-10HP Systems', 'Off-Grid Ready', 'Low Maintenance', 'High Efficiency'],
    },
  ];

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-primary">{t.services.title}</h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="border-muted hover:border-accent hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl text-primary">{service.title}</CardTitle>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-foreground/80">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
