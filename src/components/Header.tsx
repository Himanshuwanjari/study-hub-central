import { GraduationCap, Bookmark, Menu, X, LogOut, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { NavLink } from './NavLink';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  bookmarkCount: number;
  showBookmarks: boolean;
  onToggleBookmarks: () => void;
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export function Header({
  bookmarkCount,
  showBookmarks,
  onToggleBookmarks,
  onMenuToggle,
  isMobileMenuOpen,
}: HeaderProps) {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-lg text-foreground">CampusVault</h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Your Academic Gateway</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <NavLink to="/">Resources</NavLink>
          <NavLink to="/pyq">PYQ</NavLink>
          {user && <NavLink to="/my-submissions">MySubmissions</NavLink>}
          {(role === 'teacher' || role === 'admin') && (
            <NavLink to="/faculty">Faculty</NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {role && (
            <span className="hidden sm:inline text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground capitalize font-medium">
              {role}
            </span>
          )}
          <ThemeToggle />
          <Button
            variant={showBookmarks ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleBookmarks}
            className={cn('relative', showBookmarks && 'bg-primary text-primary-foreground')}
          >
            <Bookmark className={cn('w-4 h-4', showBookmarks && 'fill-current')} />
            <span className="hidden sm:inline ml-2">Bookmarks</span>
            {bookmarkCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium flex items-center justify-center">
                {bookmarkCount}
              </span>
            )}
          </Button>
          {user ? (
            <Button variant="ghost" size="sm" onClick={signOut} title="Sign out">
              <LogOut className="w-4 h-4" />
            </Button>
          ) : (
            <Button size="sm" onClick={() => navigate('/auth')}>
              <LogIn className="w-4 h-4 mr-1.5" />
              <span className="hidden sm:inline">Login</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
