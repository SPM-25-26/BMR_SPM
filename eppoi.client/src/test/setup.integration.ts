if (process.env.INTEGRATION_INSECURE_TLS === '1') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  // Solo demo/locale: disabilita validazione certificato TLS
  // NON usare in ambienti reali/CI pubblica.
  // eslint-disable-next-line no-console
  console.warn('[integration-tests] TLS verification disabled (INTEGRATION_INSECURE_TLS=1)');
}