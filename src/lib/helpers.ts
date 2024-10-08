export const romanNumerals: { [key: number]: string } = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII',
  8: 'VIII',
  9: 'IX'
};

export const urnToTitle = (urn: string): string => {
  const parts = urn.split(':')[3].split('-');
  const regio = parseInt(parts[0].replace('r', ''));
  const insula = parseInt(parts[1].replace('i', ''));
  const property = parseInt(parts[2].replace('p', ''));
  const room = parts[4];
  return `Regio ${romanNumerals[regio]}, Insula ${insula}, Property ${property}, Room ${room}`;
};
