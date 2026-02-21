import gql from 'graphql-tag';
import { Skin } from '../SkinList/types';
import { DotFragment } from 'fragments';

export interface Data {
  Skin: Skin;
}

export const query = gql`
  query ($id: Int!) {
    Skin(rowid: $id) {
      rowid
      FaceId
      FreeCondition
      FaceId_RarityGroup01
      FaceId_RarityGroup02
      FaceId_RarityGroup03
      FaceId_RarityGroup04
      FaceId_RarityGroup05
      FaceId_RarityGroup06
      FaceId_RarityGroup08
      Image
      Illust
      Dots {
        ...Dot
      }
      Units {
        ...{
          cardID
          name
          rarity
        }
      }
    }
  }
  ${DotFragment}
`;
