/**
 * Placeholder photography is served from Unsplash by photo ID.
 * To use the studio's own photography, put files in /public/images and pass
 * a path starting with "/" (e.g. "/images/projects/al-safa/cover.jpg") anywhere an ID is used.
 */
export function img(source: string, width = 1600, quality = 80) {
  if (source.startsWith('/') || source.startsWith('http')) return source;
  return `https://images.unsplash.com/photo-${source}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

export const pageImages = {
  homeHero: '1611048267451-e6ed903d4a38',
  homeAboutPrimary: '1600607687939-ce8a6c25118c',
  homeAboutSecondary: '1616137466211-f939a420be84',
  aboutStory: '1600573472550-8090b5e0745e',
  craft: ['1503387762-592deb58ef4e', '1541888946425-d81bb19240f5', '1504307651254-35680f356dfd'],
  materials: {
    stone: '1566305977571-5666677c6e98',
    timber: '1600047508788-786f3865b4b9',
    metal: '1600607687920-4e2a09cf159d',
    sustainable: '1600494603989-9650cf6ddd3d',
  },
} as const;
