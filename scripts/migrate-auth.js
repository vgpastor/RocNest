#!/usr/bin/env node
/**
 * Migration Script: Supabase Auth to JWT
 * Automatically replaces Supabase auth patterns with authService
 */

const fs = require('fs');
const path = require('path');

// Files to migrate (already identified from grep search)
const filesToMigrate = [
    'app/api/organizations/[orgId]/members/route.ts',
    'app/api/organizations/[orgId]/members/[userId]/route.ts',
    'app/api/organizations/[orgId]/reservations/route.ts',
    'app/api/organizations/[orgId]/reservations/[id]/route.ts',
    'app/api/organizations/[orgId]/reservations/[id]/deliver/route.ts',
    'app/api/organizations/ API route.ts[orgId]/reservations/[id]/extend/route.ts',
    'app/api/organizations/[orgId]/reservations/[id]/return/route.ts',
    'app/api/catalog/items/route.ts',
    'app/api/catalog/transformations/subdivide/route.ts',
    'app/api/catalog/transformations/donate/route.ts',
    'app/api/catalog/transformations/deteriorate/route.ts',
];

const rootDir = process.cwd();

function migrateFile(relPath) {
    const filePath = path.join(rootDir, relPath);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${relPath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Replace import
    if (content.includes("from '@/lib/supabase/server'")) {
        content = content.replace(
            /import { createClient } from '@\/lib\/supabase\/server'/g,
            "import { authService, AuthenticationError } from '@/lib/auth'"
        );
        modified = true;
    }

    // Replace auth pattern
    const authPattern = /const supabase = await createClient\(\)\s*const { data: { user }(?:, error: authError)? } = await supabase\.auth\.getUser\(\)\s*if \((?:authError \|\| )?!user\) {\s*return NextResponse\.json\([^}]+}, { status: 401 }\)\s*}/gs;

    if (authPattern.test(content)) {
        content = content.replace(
            authPattern,
            `const user = await authService.requireAuth()`
        );
        modified = true;
    }

    // Replace user.id with user.userId
    content = content.replace(/\buser\.id\b/g, 'user.userId');

    // Add try-catch if not present
    if (content.includes('authService.requireAuth()') && !content.includes('AuthenticationError')) {
        // Wrap function body in try-catch (simplified - manual review recommended)
        console.log(`⚠️  ${relPath}: Manual review needed for error handling`);
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Migrated: ${relPath}`);
    } else {
        console.log(`⏭️  No changes needed: ${relPath}`);
    }
}

console.log('🚀 Starting Supabase to JWT Migration...\n');

filesToMigrate.forEach(migrateFile);

console.log('\n✨ Migration complete!');
console.log('⚠️  Please manually review files marked for review');
