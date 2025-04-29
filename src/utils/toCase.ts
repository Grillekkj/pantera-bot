export function toPascalCase(input: string): string {
  const words = input.replace(/[^a-zA-Z0-9]/g, ' ').split(/[\s_]+/);

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

export function toKebabCase(input: string): string {
  return input.replace(/[\s_]+/g, '-').toLowerCase();
}

export function toCapitalCase(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1);
}
