import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, ChefHat, Users, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">PlateSync</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Staff Access
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Restaurant Management System
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight tracking-tight">
            Manage your restaurant,{' '}
            <span className="text-primary">effortlessly.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From kitchen to counter — orders, tables, billing, and analytics in one unified dashboard built for speed.
          </p>

          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl text-base font-semibold hover:bg-primary/90 transition-all hover:gap-3 shadow-lg shadow-primary/20"
          >
            Staff Access <ArrowRight className="h-5 w-5" />
          </button>

          {/* Feature cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            {[
              { icon: UtensilsCrossed, label: 'Order Management' },
              { icon: ChefHat, label: 'Kitchen Display' },
              { icon: Users, label: 'Staff Control' },
              { icon: ShieldCheck, label: 'Admin Panel' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="p-5 rounded-xl bg-card border border-border hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default"
              >
                <Icon className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} PlateSync — Restaurant Management System
      </footer>
    </div>
  );
}
