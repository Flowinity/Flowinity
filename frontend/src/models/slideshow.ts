export interface Slideshow {
  id: number;
  name: string;

  shareLink: string;

  userId: number;

  collectionIds: number[];

  includeGallery: boolean;

  speed: number;

  scaling: string;

  showCaptions: boolean;
}
