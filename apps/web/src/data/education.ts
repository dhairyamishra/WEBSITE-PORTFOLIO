export interface Education {
  institution: string;
  subtitle?: string;
  degree: string;
  date: string;
  location?: string;
  gpa?: string;
  brand: string;
  brandBgClass: string;
}

export const education: Education[] = [
  {
    institution: 'New York University',
    subtitle: 'Courant Institute',
    degree: 'M.S. Computer Science (AI)',
    date: 'May 2026',
    gpa: '3.7',
    brand: 'nyu',
    brandBgClass: 'bg-neon-violet/10 border-neon-violet/20',
  },
  {
    institution: 'Trine University',
    degree: 'B.S. Software Engineering & Mathematics',
    date: 'Dec 2021',
    location: 'Angola, IN',
    brand: 'trine',
    brandBgClass: 'bg-neon-rose/10 border-neon-rose/20',
  },
];
