/**
 * Generates consistent, professional monogram avatar styles strictly matching the pinned palette:
 * #E50914, #B81D24, #221F1F, #F5F5F1
 */
const PALETTES = [
  { bg: 'bg-[#221F1F]', text: 'text-[#F5F5F1]', border: 'border-[#221F1F]' },
  { bg: 'bg-[#E50914]/10', text: 'text-[#E50914]', border: 'border-[#E50914]/20' },
  { bg: 'bg-[#B81D24]/10', text: 'text-[#B81D24]', border: 'border-[#B81D24]/20' },
  { bg: 'bg-white', text: 'text-[#221F1F]', border: 'border-[#E2E2D8]' },
  { bg: 'bg-[#EAEAE5]', text: 'text-[#221F1F]', border: 'border-[#D8D8CF]' },
];

export function getCompanyAvatar(company: string): {
  initials: string;
  className: string;
} {
  const clean = (company || '').trim();
  if (!clean) {
    return {
      initials: '?',
      className: 'bg-[#EAEAE5] text-[#221F1F] border-[#D8D8CF]',
    };
  }

  const words = clean.split(/\s+/);
  const initials =
    words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : clean.slice(0, 2).toUpperCase();

  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = clean.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTES.length;
  const palette = PALETTES[index];

  return {
    initials,
    className: `${palette.bg} ${palette.text} ${palette.border}`,
  };
}
