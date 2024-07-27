module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        'semi': ['error', 'always'], // 세미콜론 사용 강제
        'quotes': ['error', 'single'], // 싱글 쿼트 사용 강제
        'eqeqeq': ['error', 'always'], // 일치 연산자 사용 강제 (===, !==)
        'no-var': 'error', // var 사용 금지 (let, const 사용 권장)
        'prefer-const': 'error', // 값이 변경되지 않는 변수는 const 사용
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // 사용하지 않는 변수 금지 (단, _로 시작하는 변수는 제외)
        'no-debugger': 'error', // debugger 사용 금지

        '@typescript-eslint/no-explicit-any': 'off', // any 타입 사용 허용 (필요에 따라 'warn' 또는 'error'로 변경)
        '@typescript-eslint/explicit-function-return-type': 'off', // 함수 반환 타입 명시 생략 허용
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // 사용하지 않는 변수 금지 (단, _로 시작하는 변수는 제외)
    },
};
