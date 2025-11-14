export interface Flashcard {
  id: string;
  deck: string;
  isFavorite?: boolean;
  sideA: string;
  sideAImage?: string | null;
  sideB: string;
  sideBImage?: string | null;
  sideC: string;
  sideCImage?: string | null;
}

export type CardSide = 'A' | 'B' | 'C';
