export type PPMRecord = {
  id: string;
  imageURL: string;
  caption: string;
  volume: number;
  page: number;
  regio: number;
  
  // should be a number, will be a string for now
  insula: string;
  
  doorway: string;
}