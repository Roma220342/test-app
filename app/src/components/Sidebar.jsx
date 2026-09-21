import { useEffect, useRef, useState } from "react";
import {
  Search,
  Users,
  Receipt,
  Megaphone,
  Tag,
  Gift,
  Fuel,
  Award,
  BadgeCheck,
  MapPin,
  Layers,
  UsersRound,
  Handshake,
  SlidersHorizontal,
  ShieldCheck,
  MessageSquare,
  Database,
  BookOpen,
  FolderTree,
  Sparkles,
  Settings,
  HelpCircle,
  ChevronsUpDown,
} from "lucide-react";
import ScrollArea from "./ui/ScrollArea";
import LogoMark from "./ui/LogoMark";
import UserAvatarIcon from "./ui/UserAvatarIcon";

const NAV_GROUPS = [
  {
    label: "Customers",
    items: [
      { label: "Search Customer", icon: Users, page: "customers" },
      { label: "Transactions", icon: Receipt },
    ],
  },
  {
    label: "Campaigns & Offers",
    items: [
      { label: "Campaign Config", icon: Megaphone },
      { label: "Promotion Codes", icon: Tag },
      { label: "Gifts", icon: Gift },
      { label: "Fuel Discount", icon: Fuel },
    ],
  },
  {
    label: "Rewards Program",
    items: [
      { label: "Award Rule", icon: Award },
      { label: "Badges", icon: BadgeCheck },
      { label: "Beacon Map", icon: MapPin },
      { label: "Tier", icon: Layers },
      { label: "Member-get-Member", icon: UsersRound },
    ],
  },
  {
    label: "Partners",
    items: [
      { label: "Partner Management", icon: Handshake, page: "partners" },
    ],
  },
  {
    label: "Rules & Limits",
    items: [
      { label: "Transaction Limit", icon: SlidersHorizontal },
      { label: "Validity Limitation", icon: ShieldCheck },
      { label: "Receipt Message", icon: MessageSquare },
    ],
  },
  {
    label: "Data",
    items: [
      { label: "DataLab", icon: Database },
      { label: "Catalog", icon: BookOpen },
      { label: "Catalog Category", icon: FolderTree },
      { label: "Gamification", icon: Sparkles },
    ],
  },
];

function NavGroup({ label, items, activePage, onNavigate }) {
  return (
    <div>
      <p className="px-2.5 mb-1.5 text-xs font-medium tracking-wide text-ink-faint">
        {label}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => {
          const isActive = item.page && item.page === activePage;
          return (
            <li key={item.label}>
              {item.page ? (
                <button
                  type="button"
                  onClick={() => onNavigate(item.page)}
                  className={
                    isActive
                      ? "flex w-full items-center gap-2.5 rounded-lg border border-transparent bg-surface px-2.5 py-2 text-sm font-normal text-ink transition-colors"
                      : "flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2.5 py-2 text-sm font-normal text-ink-soft transition-colors hover:bg-surface hover:text-ink"
                  }
                >
                  <item.icon
                    className={`h-4 w-4 shrink-0 ${isActive ? "text-ink" : "text-ink-faint"}`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              ) : (
                <div className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-normal text-ink-soft cursor-default select-none">
                  <item.icon className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Sidebar({ activePage, onNavigate }) {
  const [navQuery, setNavQuery] = useState("");
  const [navFocused, setNavFocused] = useState(false);
  const navInputRef = useRef(null);

  // "/" is a common jump-to-search shortcut (Linear, GitHub, Slack) — a
  // fast path around typing that doesn't compete with any single-key
  // shortcut already in use elsewhere on this page.
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key !== "/") return
      const target = e.target
      const isTyping =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      if (isTyping) return
      e.preventDefault()
      navInputRef.current?.focus()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // The menu itself was the loudest complaint in research ("so many different
  // thing... overwhelming"), so the nav is filterable rather than only
  // regrouped — you can type instead of scanning ~30 items.
  const query = navQuery.trim().toLowerCase();
  const filteredGroups = query
    ? NAV_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter((item) => item.label.toLowerCase().includes(query)),
      })).filter((group) => group.items.length > 0)
    : NAV_GROUPS;

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col overflow-hidden bg-transparent">
      <div className="flex h-16 shrink-0 items-center gap-2.5 px-2.5">
        <LogoMark className="h-9 w-auto shrink-0" />
        <span className="text-base font-semibold tracking-tight text-ink">LOD Console</span>
      </div>

      <div className="shrink-0 px-2.5 pb-2">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
            aria-hidden="true"
          />
          <input
            ref={navInputRef}
            type="text"
            value={navQuery}
            onChange={(e) => setNavQuery(e.target.value)}
            onFocus={() => setNavFocused(true)}
            onBlur={() => setNavFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") e.currentTarget.blur()
            }}
            placeholder="Search"
            aria-label="Search navigation"
            className="w-full rounded-lg border border-transparent bg-transparent py-2 pl-9 pr-8 text-sm font-normal text-ink placeholder:text-ink-faint transition-colors duration-200 hover:border-border-hover hover:bg-surface focus:border-ink focus:bg-surface focus:outline-none"
          />
          {!navFocused && !navQuery && (
            <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-surface-sunken px-1.5 py-0.5 text-xs font-medium text-ink-faint">
              /
            </kbd>
          )}
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1" innerClassName="px-2.5 py-2">
        {filteredGroups.length === 0 ? (
          <p className="px-2.5 py-6 text-center text-xs text-ink-faint">
            Nothing matches “{navQuery}”
          </p>
        ) : (
          <div className="space-y-5">
            {filteredGroups.map((group) => (
              <NavGroup
                key={group.label}
                label={group.label}
                items={group.items}
                activePage={activePage}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="shrink-0 border-t border-ink/10 p-2.5">
        <ul className="space-y-0.5 pb-2">
          <li>
            <button
              type="button"
              onClick={() => {}}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-normal text-ink-soft transition-colors hover:bg-surface hover:text-ink"
            >
              <Settings className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
              Settings
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => {}}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-normal text-ink-soft transition-colors hover:bg-surface hover:text-ink"
            >
              <HelpCircle className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
              Help & Support
            </button>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => {}}
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-surface"
        >
          <UserAvatarIcon className="h-9 w-9 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">Alex Danvers</p>
            <p className="truncate text-xs text-ink-faint">a.danvers@mail.com</p>
          </div>
          <ChevronsUpDown size={14} className="shrink-0 text-ink-faint" />
        </button>
      </div>
    </aside>
  );
}
