export const intersect = (a, b) => [...new Set(a.filter(i => new Set(b).has(i)))];
