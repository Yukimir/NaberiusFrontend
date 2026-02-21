import { Dot } from 'interfaces';

export interface Skin {
  rowid: number;
  FaceId: number;
  FreeCondition: number;
  FaceId_RarityGroup01: number;
  FaceId_RarityGroup02: number;
  FaceId_RarityGroup03: number;
  FaceId_RarityGroup04: number;
  FaceId_RarityGroup05: number;
  FaceId_RarityGroup06: number;
  FaceId_RarityGroup08: number;
  Image: [string];
  Illust: string;
  Dots: Dot[];
  Units: UnitsWithSkin[];
}

export interface UnitsWithSkin {
  cardID: number;
  name: string;
  rarity: number;
}
