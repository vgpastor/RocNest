'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    baseUrl?: string
}

export default function Pagination({ currentPage, totalPages, baseUrl = '/catalog' }: PaginationProps) {
    const searchParams = useSearchParams()

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page.toString())
        return `${baseUrl}?${params.toString()}`
    }

    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-center space-x-2 mt-8">
            <Link
                href={createPageUrl(currentPage - 1)}
                className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                aria-disabled={currentPage <= 1}
            >
                <Button variant="outline" size="sm" disabled={currentPage <= 1}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                </Button>
            </Link>

            <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Simple logic to show a window of pages around current page
                    // For now, just showing first 5 or logic to be improved if needed
                    // Let's implement a sliding window logic for better UX
                    let pageNum = i + 1
                    if (totalPages > 5) {
                        if (currentPage > 3) {
                            pageNum = currentPage - 2 + i
                        }
                        if (pageNum > totalPages) {
                            pageNum = totalPages - 4 + i
                        }
                    }

                    // Ensure we don't go out of bounds (though the logic above tries to handle it)
                    if (pageNum < 1) pageNum = 1
                    if (pageNum > totalPages) return null

                    return (
                        <Link key={pageNum} href={createPageUrl(pageNum)}>
                            <Button
                                variant={currentPage === pageNum ? 'primary' : 'ghost'}
                                size="sm"
                                className="w-9 h-9 p-0"
                            >
                                {pageNum}
                            </Button>
                        </Link>
                    )
                })}
            </div>

            <Link
                href={createPageUrl(currentPage + 1)}
                className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                aria-disabled={currentPage >= totalPages}
            >
                <Button variant="outline" size="sm" disabled={currentPage >= totalPages}>
                    Siguiente
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </Link>
        </div>
    )
}
