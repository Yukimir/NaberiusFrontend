import { ICO_URL } from 'consts';

export function getTreasureURI(treasure: number): string {
  return `${ICO_URL}/0/${
    (treasure >= 1000 && treasure < 1000000 ?
    '_' + treasure :
    treasure >= 1001000 ?
    treasure - 1000000 :
    treasure
    )
    }.png`;
}
