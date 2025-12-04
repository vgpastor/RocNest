import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { OrganizationSelector } from './OrganizationSelector'
import { Logo } from '@/components'

export default async function SelectOrganizationPage() {
    const session = await getSessionUser()

    if (!session) {
        redirect('/login')
    }

    // Obtener todas las organizaciones del usuario
    const userOrganizations = await prisma.userOrganization.findMany({
        where: {
            userId: session.userId,
        },
        include: {
            organization: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    logoUrl: true,
                },
            },
        },
        orderBy: {
            joinedAt: 'desc',
        },
    })

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-background)]">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center space-y-4">
                    <div className="flex justify-center mb-6">
                        <Logo size={64} />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Selecciona una Organización
                    </h2>
                    <p className="text-lg text-[var(--color-muted-foreground)]">
                        Elige la organización con la que quieres trabajar o crea una nueva
                    </p>
                </div>

                <OrganizationSelector
                    organizations={userOrganizations}
                    userId={session.userId}
                />
            </div>
        </div>
    )
}
