module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:prettier/recommended',
    ],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: ['react', 'react-hooks', 'prettier'],
    rules: {
      'react/prop-types': 'warn', // Advertencia si los PropTypes no están definidos
      'no-console': 'warn', // Advertencia cuando se utiliza console.log
      'react/jsx-uses-react': 'off', // Desactivar la advertencia por no usar React explícitamente
      'react/jsx-uses-vars': 'error', // Error cuando las variables no son usadas
      'prettier/prettier': 'error', // Asegurar que el código sigue las reglas de Prettier
      'no-unused-vars': 'warn', // Advertencia si hay variables no utilizadas
      'react/react-in-jsx-scope': 'off', // No es necesario importar React en JSX con React 17+
    },
  };
  