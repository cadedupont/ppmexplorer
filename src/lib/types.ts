export type PPMItem = {
  id: string;
  imageURL: string;
  caption?: string;
  caption_en: string;
  volume: number;
  page: number;
  location: {
    regio: number;
    insula: number;
    property: number;
    geojson: GeoJSON.GeometryCollection | null;
  }
  imageVector?: number[];
  captionVector?: number[];
}