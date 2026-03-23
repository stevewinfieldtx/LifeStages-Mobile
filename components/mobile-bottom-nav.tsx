"use client"

import { usePathname, useRouter } from "next/navigation"
import { hapticTap } from "@/lib/native-features"

const navItems = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/bible", icon: "menu_book", label: "Bible" },
  { href: "/verse", icon: "auto_awesome", label: "Deeper", isAccent: true },
  { href: "/subscription", icon: "workspace_premium", label: "Premium" },
  { href: "/profile", icon: "person", label: "Profile" },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleNav = (href: string) => {
    hapticTap()
    router.push(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto">
      <div className="bg-[#0c1929]/90 backdrop-blur-xl border-t border-white/[0.06]">
        <div className="flex items-center justify-around px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
          {navItems.map((item) => {
            const isActive = item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)

            if (item.isAccent) {
              return (
                <button key={item.href} onClick={() => handleNav(item.href)} className="flex flex-col items-center gap-0.5 -mt-3">
                  <div className={`size-11 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    isActive
                      ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30"
                      : "bg-gradient-to-br from-amber-500/80 to-orange-500/80 shadow-amber-500/10"
                  }`}>
                    <span className="material-symbols-outlined text-white text-xl">{item.icon}</span>
                  </div>
                  <span className={`text-[9px] font-semibold ${isActive ? "text-amber-400" : "text-blue-200/40"}`}>{item.label}</span>
                </button>
              )
            }

            return (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors relative ${
                  isActive ? "text-amber-400" : "text-blue-200/40"
                }`}
              >
                <span className="material-symbols-outlined text-xl" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {item.icon}
                </span>
                <span className={`text-[9px] font-semibold ${isActive ? "text-amber-400" : "text-blue-200/40"}`}>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
