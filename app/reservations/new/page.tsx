// New Reservation Form Page
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentOrganizationId } from '@/lib/organization-helpers';
import { prisma } from '@/lib/prisma';
import NewReservationForm from './NewReservationForm';

export default async function NewReservationPage() {
    const supabase = await createClient();

    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // Get organization
    const organizationId = await getCurrentOrganizationId();
    if (!organizationId) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Selecciona una organización</h2>
                    <p className="text-muted-foreground">Por favor selecciona una organización</p>
                </div>
            </div>
        );
    }

    // Get user role
    const userOrg = await prisma.userOrganization.findUnique({
        where: {
            userId_organizationId: {
                userId: user.id,
                organizationId,
            },
        },
    });

    const isAdmin = userOrg?.role === 'admin' || userOrg?.role === 'owner';

    // Fetch categories for the form
    const categories = await prisma.category.findMany({
        where: { organizationId },
        select: {
            id: true,
            name: true,
            icon: true,
        },
        orderBy: { name: 'asc' },
    });

    // Fetch users if admin (to create for others)
    const users = isAdmin
        ? await prisma.userOrganization.findMany({
            where: { organizationId },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
        })
        : [];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Nueva Reserva</h1>
                <p className="text-muted-foreground">
                    Solicita material para tu próxima actividad
                </p>
            </div>

            <NewReservationForm
                organizationId={organizationId}
                currentUserId={user.id}
                isAdmin={isAdmin}
                categories={categories}
                users={users.map(uo => ({
                    id: uo.user.id,
                    name: uo.user.fullName || uo.user.email,
                    email: uo.user.email,
                }))}
            />
        </div>
    );
}
