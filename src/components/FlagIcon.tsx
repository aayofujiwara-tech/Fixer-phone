import type { ReactNode } from 'react';
import FlagJP from 'country-flag-icons/react/3x2/JP';
import FlagUS from 'country-flag-icons/react/3x2/US';
import FlagCN from 'country-flag-icons/react/3x2/CN';
import FlagRU from 'country-flag-icons/react/3x2/RU';
import FlagGB from 'country-flag-icons/react/3x2/GB';
import FlagFR from 'country-flag-icons/react/3x2/FR';
import FlagDE from 'country-flag-icons/react/3x2/DE';
import FlagKR from 'country-flag-icons/react/3x2/KR';
import FlagIL from 'country-flag-icons/react/3x2/IL';
import FlagIN from 'country-flag-icons/react/3x2/IN';
import FlagSA from 'country-flag-icons/react/3x2/SA';
import FlagVA from 'country-flag-icons/react/3x2/VA';

const flagMap: Record<string, (props: { className?: string }) => ReactNode> = {
  jp: FlagJP,
  us: FlagUS,
  cn: FlagCN,
  ru: FlagRU,
  uk: FlagGB,
  fr: FlagFR,
  de: FlagDE,
  kr: FlagKR,
  il: FlagIL,
  in: FlagIN,
  sa: FlagSA,
  va: FlagVA,
};

interface FlagIconProps {
  countryId: string;
  className?: string;
}

export function FlagIcon({ countryId, className }: FlagIconProps) {
  const Flag = flagMap[countryId];
  if (!Flag) return null;
  return <Flag className={className} />;
}
