interface BreadcrumbProps {
  current: boolean;
}

interface CreateBreadcrumbReturn {
  sync: (props: BreadcrumbProps) => { 'aria-current': 'page' | undefined };
}

export function createBreadcrumb(): CreateBreadcrumbReturn {
  return {
    sync: ({ current }: BreadcrumbProps) => {
      return {
        'aria-current': current ? 'page' : undefined,
      };
    },
  };
}
