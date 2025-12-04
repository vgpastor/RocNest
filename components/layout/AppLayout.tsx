'use client'

import { useState } from 'react'

import { FadeIn } from '@/components/ui/motion'

import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function AppLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--color-background)] font-sans selection:bg-[var(--color-primary)] selection:text-white">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)]/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-info)]/5 blur-[120px]" />
            </div>

            <Sidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out relative z-10">
                <Header setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
                    <FadeIn className="mx-auto max-w-7xl">
                        {children}
                    </FadeIn>
                </main>
            </div>
        </div>
    )
}
