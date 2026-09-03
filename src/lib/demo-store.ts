import { create } from "zustand";
import { toast } from "sonner";

const INSIGHTS_KEY = "todays-insights-dismissed";

const readDismissed = () => {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(INSIGHTS_KEY) === "1";
  } catch {
    return false;
  }
};

export type Role = "editor" | "viewer";
export type Cadence = "" | "live" | "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
export type Granularity = "page" | "module" | "widget";
export type View = "dashboard" | "report";

export type QuickFilterKey = "assigned" | "tags" | "company" | "followers" | "contactType";

export type DashboardFilters = {
  datePreset: string;
  from: string; // ISO yyyy-mm-dd
  to: string;
  comparison: string;
  quick: Record<QuickFilterKey, string | null>;
};

export const DEFAULT_DATE_PRESET = "Last 30 days";

export const defaultFilters = (): DashboardFilters => ({
  datePreset: DEFAULT_DATE_PRESET,
  from: "2026-07-28",
  to: "2026-08-26",
  comparison: "No comparison",
  quick: {
    assigned: null,
    tags: null,
    company: null,
    followers: null,
    contactType: null,
  },
});

// Number of filters that deviate from their defaults — used for the widget badge.
export const activeFilterCount = (f: DashboardFilters): number => {
  let n = f.datePreset !== DEFAULT_DATE_PRESET ? 1 : 0;
  (Object.keys(f.quick) as QuickFilterKey[]).forEach((k) => {
    if (f.quick[k]) n++;
  });
  return n;
};

type Settings = {
  title: string;
  granularity: Granularity;
  cadence: Cadence;
  instructions: string;
};

export const DASHBOARD_TITLE = "Summary of 'Sales overview' dashboard";
export const REPORT_TITLE = "Summary of 'General Widgets' report";

type Surface = {
  exists: boolean;
  lastUpdated: Date | null;
  isGenerating: boolean;
  highlight: boolean;
  settings: Settings;
};

type State = {
  role: Role;
  view: View;
  editMode: boolean;
  askPanelOpen: boolean;
  askExpandedOpen: boolean;
  addWidgetOpen: boolean;
  editDrawerOpen: boolean;
  insightsDismissed: boolean;
  dismissInsights: () => void;

  // Text the user selected + "dig deeper" on — seeded into the Ask AI thread.
  askSeed: string | null;
  openAskWithSeed: (seed: string) => void;
  clearAskSeed: () => void;

  // Prototype feature toggles — off by default; enable to preview deferred concepts.
  todaysInsightsEnabled: boolean;
  summaryAiEnabled: boolean;
  refreshFrequencyEnabled: boolean;
  summaryPromptBarEnabled: boolean;
  setTodaysInsightsEnabled: (v: boolean) => void;
  setSummaryAiEnabled: (v: boolean) => void;
  setRefreshFrequencyEnabled: (v: boolean) => void;
  setSummaryPromptBarEnabled: (v: boolean) => void;

  filters: DashboardFilters;
  setDateRange: (preset: string, from: string, to: string, comparison: string) => void;
  setQuickFilter: (key: QuickFilterKey, value: string | null) => void;
  clearFilters: () => void;

  dashboard: Surface;
  report: Surface;

  // legacy getters (kept so SummaryWidget code stays untouched)
  widgetExists: boolean;
  lastUpdated: Date | null;
  isGenerating: boolean;
  highlightWidget: boolean;
  settings: Settings;

  setRole: (r: Role) => void;
  setView: (v: View) => void;
  setEditMode: (e: boolean) => void;
  openAskPanel: () => void;
  closeAskPanel: () => void;
  openAskExpanded: () => void;
  closeAskExpanded: () => void;
  openAddWidget: () => void;
  closeAddWidget: () => void;
  openEditDrawer: () => void;
  closeEditDrawer: () => void;
  saveAsWidget: () => void;
  deleteWidget: () => void;
  regenerate: () => Promise<void>;
  updateSettings: (s: Partial<Settings>) => void;
  resetSettings: () => void;
};

export const DEFAULT_INSTRUCTIONS =
  "Summarize the key trends and notable changes across modules. Call out anomalies, big movers, and anything that needs attention. Keep bullets concise and action-oriented.";

// System-default settings for a surface — used to reset fields in the drawer.
export const defaultSettings = (isReport: boolean): Settings => ({
  title: isReport ? REPORT_TITLE : DASHBOARD_TITLE,
  granularity: isReport ? "page" : "module",
  cadence: isReport ? "" : "daily",
  instructions: DEFAULT_INSTRUCTIONS,
});

const blankSurface = (): Surface => ({
  exists: false,
  lastUpdated: null,
  isGenerating: false,
  highlight: false,
  settings: {
    title: DASHBOARD_TITLE,
    granularity: "module",
    cadence: "",
    instructions: DEFAULT_INSTRUCTIONS,
  },
});

export const useDemoStore = create<State>((set, get) => {
  const active = () => (get().view === "report" ? "report" : "dashboard");
  const patchActive = (patch: Partial<Surface>) => {
    const key = active();
    set({ [key]: { ...get()[key], ...patch } } as Partial<State>);
    syncLegacy();
  };
  const syncLegacy = () => {
    const s = get()[active()];
    set({
      widgetExists: s.exists,
      lastUpdated: s.lastUpdated,
      isGenerating: s.isGenerating,
      highlightWidget: s.highlight,
      settings: s.settings,
    });
  };

  const maybeLiveRefresh = () => {
    const s = get();
    if (s.view === "dashboard" && s.dashboard.exists && s.dashboard.settings.cadence === "live") {
      void s.regenerate();
    }
  };

  const dashboard = blankSurface();
  dashboard.settings.cadence = "daily"; // dashboards default to a once-a-day refresh
  const report = blankSurface();
  report.settings.granularity = "page";
  report.settings.title = REPORT_TITLE;

  return {
    role: "editor",
    view: "dashboard",
    editMode: false,
    askPanelOpen: false,
    askExpandedOpen: false,
    addWidgetOpen: false,
    editDrawerOpen: false,
    insightsDismissed: readDismissed(),
    askSeed: null,
    todaysInsightsEnabled: false,
    summaryAiEnabled: false,
    refreshFrequencyEnabled: false,
    summaryPromptBarEnabled: true,
    filters: defaultFilters(),

    dashboard,
    report,

    widgetExists: dashboard.exists,
    lastUpdated: dashboard.lastUpdated,
    isGenerating: dashboard.isGenerating,
    highlightWidget: dashboard.highlight,
    settings: dashboard.settings,

    setRole: (role) => set({ role }),
    setView: (view) => {
      set({ view, editMode: false });
      syncLegacy();
    },
    setEditMode: (editMode) => set({ editMode }),
    openAskPanel: () => set({ askPanelOpen: true, askSeed: null }),
    openAskWithSeed: (seed) => set({ askPanelOpen: true, askSeed: seed }),
    clearAskSeed: () => set({ askSeed: null }),
    setTodaysInsightsEnabled: (v) => set({ todaysInsightsEnabled: v }),
    setSummaryAiEnabled: (v) => set({ summaryAiEnabled: v }),
    setRefreshFrequencyEnabled: (v) => set({ refreshFrequencyEnabled: v }),
    setSummaryPromptBarEnabled: (v) => set({ summaryPromptBarEnabled: v }),
    closeAskPanel: () => set({ askPanelOpen: false }),
    openAskExpanded: () => set({ askExpandedOpen: true, askPanelOpen: false }),
    closeAskExpanded: () => set({ askExpandedOpen: false }),
    openAddWidget: () => set({ addWidgetOpen: true }),
    closeAddWidget: () => set({ addWidgetOpen: false }),
    openEditDrawer: () => set({ editDrawerOpen: true }),
    closeEditDrawer: () => set({ editDrawerOpen: false }),

    dismissInsights: () => {
      try {
        sessionStorage.setItem(INSIGHTS_KEY, "1");
      } catch {
        /* ignore */
      }
      set({ insightsDismissed: true });
    },

    setDateRange: (preset, from, to, comparison) => {
      set({ filters: { ...get().filters, datePreset: preset, from, to, comparison } });
      maybeLiveRefresh();
    },
    setQuickFilter: (key, value) => {
      set({
        filters: { ...get().filters, quick: { ...get().filters.quick, [key]: value } },
      });
      maybeLiveRefresh();
    },
    clearFilters: () => set({ filters: defaultFilters() }),

    saveAsWidget: () => {
      const isDashboard = get().view !== "report";
      patchActive({ exists: true, lastUpdated: new Date(), highlight: true });
      set({ askPanelOpen: false, askExpandedOpen: false, addWidgetOpen: false });
      if (isDashboard) {
        try {
          sessionStorage.setItem(INSIGHTS_KEY, "1");
        } catch {
          /* ignore */
        }
        set({ insightsDismissed: true });
      }
      toast.success(
        isDashboard ? "Summary added to your dashboard." : "Summary added to your report.",
      );
      setTimeout(() => patchActive({ highlight: false }), 2400);
    },
    deleteWidget: () => patchActive({ exists: false, lastUpdated: null }),
    regenerate: async () => {
      patchActive({ isGenerating: true });
      await new Promise((r) => setTimeout(r, 2500));
      patchActive({ isGenerating: false, lastUpdated: new Date() });
    },
    updateSettings: (s) => patchActive({ settings: { ...get()[active()].settings, ...s } }),
    resetSettings: () => {
      const fresh = blankSurface().settings;
      if (active() === "report") {
        fresh.granularity = "page";
        fresh.title = REPORT_TITLE;
      }
      patchActive({ settings: fresh });
    },
  };
});
