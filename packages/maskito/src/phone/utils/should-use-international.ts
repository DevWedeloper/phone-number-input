export const shouldUseInternational = (isInternational: boolean, value: string): boolean => {
  if (!isInternational) {
    return value.startsWith('+');
  }

  return true;
}