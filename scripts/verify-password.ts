// Script de verificación de contraseña
import bcrypt from 'bcryptjs'

const FIXED_PASSWORD = '12341234'

async function testPassword() {
    console.log('🔐 Testing password hashing and verification...')
    console.log(`Password to test: "${FIXED_PASSWORD}"`)
    console.log('')

    // Hash the password
    const hash = await bcrypt.hash(FIXED_PASSWORD, 10)
    console.log(`Generated hash: ${hash}`)
    console.log('')

    // Verify correct password
    const isValidCorrect = await bcrypt.compare(FIXED_PASSWORD, hash)
    console.log(`✅ Verification with correct password ("${FIXED_PASSWORD}"): ${isValidCorrect}`)

    // Verify incorrect password
    const isValidWrong = await bcrypt.compare('wrongpassword', hash)
    console.log(`❌ Verification with wrong password ("wrongpassword"): ${isValidWrong}`)
    console.log('')

    // Test with variations
    const testCases = [
        '12341234',
        ' 12341234',  // with leading space
        '12341234 ',  // with trailing space
        '1234 1234',  // with space in middle
    ]

    console.log('Testing variations:')
    for (const testCase of testCases) {
        const result = await bcrypt.compare(testCase, hash)
        console.log(`  "${testCase}" => ${result ? '✅ VALID' : '❌ INVALID'}`)
    }
}

testPassword().catch(console.error)
