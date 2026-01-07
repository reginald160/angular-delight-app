import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Services', href: '#services' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto flex items-center justify-between py-4 px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-hero flex items-center justify-center">
            <span className="text-primary-foreground font-serif font-bold text-lg">UK</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl text-foreground">UK Pathway</span>
            <span className="text-xs text-muted-foreground -mt-1">Your Journey Starts Here</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button variant="royal" size="sm">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          'lg:hidden absolute top-full left-0 right-0 bg-card border-b border-border transition-all duration-300 overflow-hidden',
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            <Button variant="ghost" className="w-full">
              Sign In
            </Button>
            <Button variant="royal" className="w-full">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
