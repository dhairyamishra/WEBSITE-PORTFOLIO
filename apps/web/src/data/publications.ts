export interface Publication {
  title: string;
  venue: string;
  role: string;
  institution: string;
  date: string;
  venueBrand: string;
}

export const publications: Publication[] = [
  {
    title: 'Solaris: Multi-Agent Video World Models',
    venue: 'ICML 2026 (Submission)',
    role: 'Researcher/Developer',
    institution: 'NYU Courant',
    date: 'Sep 2025 – Present',
    venueBrand: 'icml',
  },
  {
    title: 'Testaro: Web Accessibility Testing Framework',
    venue: 'ACM SIGACCESS ASSETS 2023',
    role: 'Speaker/Contributor',
    institution: 'CVS Health',
    date: 'Oct 2023',
    venueBrand: 'acm',
  },
];
