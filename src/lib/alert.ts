export function createAlert() {
  return {
    alertProps: {
      role: 'alert' as const,
    },
  };
}
