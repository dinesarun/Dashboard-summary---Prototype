import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  Rocket,
  LayoutDashboard,
  MessageCircle,
  Calendar,
  Contact,
  TrendingUp,
  CreditCard,
  Bot,
  Megaphone,
  Workflow,
  Globe,
  BadgeCheck,
  Image as ImageIcon,
  Star,
  LineChart,
  Search,
  Zap,
  ChevronsUpDown,
  MapPin,
} from "lucide-react";

type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  to?: string;
  active?: boolean;
  badge?: string;
};

const TOP: NavItem[] = [
  { label: "Ask AI", icon: Sparkles, to: "/ask-ai", active: true },
  { label: "Launchpad", icon: Rocket },
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Conversations", icon: MessageCircle },
  { label: "Calendars", icon: Calendar },
  { label: "Contacts", icon: Contact },
  { label: "Opportunities", icon: TrendingUp },
  { label: "Payments", icon: CreditCard },
];

const BOTTOM: NavItem[] = [
  { label: "AI Studio", icon: Sparkles, badge: "Beta" },
  { label: "AI Agents", icon: Bot },
  { label: "Marketing", icon: Megaphone },
  { label: "Automation", icon: Workflow },
  { label: "Sites", icon: Globe },
  { label: "Memberships", icon: BadgeCheck },
  { label: "Media Storage", icon: ImageIcon },
  { label: "Reputation", icon: Star },
  { label: "Reporting", icon: LineChart },
];

function NavRow({ item }: { item: NavItem }) {
  const Icon = item.icon;
  const inner = (
    <span
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
        item.active
          ? "bg-white/10 text-white font-medium ring-1 ring-white/15"
          : "text-slate-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge && (
        <span className="rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-medium text-amber-300">
          {item.badge}
        </span>
      )}
    </span>
  );
  return item.to ? (
    <Link to={item.to}>{inner}</Link>
  ) : (
    <button type="button" className="w-full text-left">
      {inner}
    </button>
  );
}

export function HighLevelSidebar() {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col bg-[#0f1729] text-slate-200 h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-1.5 text-white font-semibold">
          <span className="text-emerald-400 text-lg leading-none">⇈</span>
          HighLevel
        </div>
      </div>

      {/* Location selector */}
      <div className="px-3">
        <button className="flex w-full items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-left hover:bg-white/10 transition">
          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">HighLevel*</div>
            <div className="text-[11px] text-slate-400">Eugene, OR</div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-slate-400 shrink-0" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-2 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-400 flex-1">Search</span>
          <kbd className="rounded bg-white/10 px-1.5 text-[10px] text-slate-300">⌘K</kbd>
        </div>
        <button className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400 hover:bg-emerald-500/30 transition">
          <Zap className="h-4 w-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
        {TOP.map((i) => (
          <NavRow key={i.label} item={i} />
        ))}
        <div className="my-2 border-t border-white/10" />
        {BOTTOM.map((i) => (
          <NavRow key={i.label} item={i} />
        ))}
      </nav>
    </aside>
  );
}
