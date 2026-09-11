/** Update these with your real links. */
export const siteConfig = {
  email: '',
  github: 'https://github.com/GhasemiGOF',
  scholar: 'https://scholar.google.com/citations?hl=en&user=mG7rRvEAAAAJ',
  linkedin: '',
  orcid: '',
};

export type FooterIcon = 'email' | 'github' | 'scholar' | 'linkedin' | 'orcid';

export interface FooterLink {
  label: string;
  href: string;
  icon: FooterIcon;
  external?: boolean;
}

export function getFooterLinks(): FooterLink[] {
  return [
    {
      label: 'Email',
      href: siteConfig.email ? `mailto:${siteConfig.email}` : '#',
      icon: 'email',
    },
    {
      label: 'GitHub',
      href: siteConfig.github || '#',
      icon: 'github',
      external: Boolean(siteConfig.github),
    },
    {
      label: 'Scholar',
      href: siteConfig.scholar || '#',
      icon: 'scholar',
      external: Boolean(siteConfig.scholar),
    },
    {
      label: 'LinkedIn',
      href: siteConfig.linkedin || '#',
      icon: 'linkedin',
      external: Boolean(siteConfig.linkedin),
    },
    {
      label: 'ORCID',
      href: siteConfig.orcid || '#',
      icon: 'orcid',
      external: Boolean(siteConfig.orcid),
    },
  ];
}
