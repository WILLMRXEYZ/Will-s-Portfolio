
export type ViewState = 'entry' | 'home';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  targetX?: number;
  targetY?: number;
  isForming?: boolean;
}

export type GridSize = '1x1' | '1x2' | '2x1' | '2x2' | '3x2' | '4x2' | '2x3';

export interface Project {
  id: number;
  title: string;
  imageUrl: string;
  driveLink?: string; // Original Google Drive Link for reference
  type: 'illustration' | 'character' | 'animation' | 'tattoo';
  mediaType?: 'image' | 'video';
  size?: GridSize; // For custom grid layout
  
  // Advanced Visuals
  filter?: string; // e.g., 'grayscale(1)'
  brightness?: number; // 100 default
  contrast?: number; // 100 default
  saturate?: number; // 100 default
  objectPosition?: string; // 'center center' default
  fit?: 'cover' | 'contain'; // object-fit
}

export interface GameState {
  score: number;
  attempts: number;
  isPlaying: boolean;
  gameOver: boolean;
  won: boolean;
}
