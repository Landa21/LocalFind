const { validatePassword, validateEmail } = require('../src/services/validationService');

function runTests() {
    console.log('🧪 Running Backend Validation Service Tests...\n');

    const passwordTests = [
        { pwd: 'Short1', expected: false, desc: 'Too short' },
        { pwd: 'password123', expected: false, desc: 'No uppercase' },
        { pwd: 'PASSWORD123', expected: false, desc: 'No lowercase' },
        { pwd: 'Password!', expected: false, desc: 'No numbers' },
        { pwd: 'StrongPass123', expected: true, desc: 'Valid password' },
        { pwd: '', expected: false, desc: 'Empty password' },
    ];

    const emailTests = [
        { email: 'user@example.com', expected: true, desc: 'Valid email' },
        { email: 'user@example', expected: false, desc: 'Invalid domain' },
        { email: 'user.example.com', expected: false, desc: 'No @ symbol' },
        { email: '', expected: false, desc: 'Empty email' },
    ];

    let passed = 0;
    let total = passwordTests.length + emailTests.length;

    console.log('--- Password Tests ---');
    passwordTests.forEach(t => {
        const result = validatePassword(t.pwd);
        if (result === t.expected) {
            console.log(`✅ PASS: [${t.desc}] - Password "${t.pwd}" -> ${result}`);
            passed++;
        } else {
            console.log(`❌ FAIL: [${t.desc}] - Password "${t.pwd}" -> Expected ${t.expected}, got ${result}`);
        }
    });

    console.log('\n--- Email Tests ---');
    emailTests.forEach(t => {
        const result = validateEmail(t.email);
        if (result === t.expected) {
            console.log(`✅ PASS: [${t.desc}] - Email "${t.email}" -> ${result}`);
            passed++;
        } else {
            console.log(`❌ FAIL: [${t.desc}] - Email "${t.email}" -> Expected ${t.expected}, got ${result}`);
        }
    });

    console.log(`\n--- Summary: ${passed}/${total} passed ---`);
    process.exit(passed === total ? 0 : 1);
}

runTests();
