export const formatIdr = (number: number): string => {
  if (isNaN(number)) return 'Rp 0';
  
  const formatted = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp ${formatted}`;
};