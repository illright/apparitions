interface DisclosureProps {
  open: boolean;
}

interface CreateDisclosureReturn {
  sync: (
    props: DisclosureProps
  ) => [Record<string, string | undefined>, Record<string, string | undefined>];
}

export function createDisclosure(): CreateDisclosureReturn {
  return {} as any;
}
