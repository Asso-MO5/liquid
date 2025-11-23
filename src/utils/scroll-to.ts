export function scrollTo(containerId: string, elementId: string) {
  const container = document.getElementById(containerId) as HTMLElement;
  if (!container) return;
  const element = document.getElementById(elementId) as HTMLElement;
  if (!element) return;
  element.scrollIntoView({ behavior: 'smooth' });
}