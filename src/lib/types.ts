export type PPMRecord = {
  id: string;
  imageURL: string;
  caption: string;
  volume: number;
  page: number;
  location: {
    regio: number;
    insula: number;
    property: number;
    geojson: GeoJSON.GeometryCollection;
  }
  captionVector: number[];
  imageVector: number[];
}