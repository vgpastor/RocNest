// Test seed entry point

import { PrismaClient } from '@prisma/client'
import { run as runMinimal } from './minimal'

export async function run(prisma: PrismaClient) {
    console.log('🧪 Running TEST seed...\n')
    await runMinimal(prisma)
    console.log('\n✅ Test seed completed!')
}
