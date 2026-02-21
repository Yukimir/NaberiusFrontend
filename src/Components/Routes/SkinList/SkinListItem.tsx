import React from 'react';
import { Row, Col } from 'antd';
import styles from './SkinList.module.less';
import { SKIN_ICO_URL } from 'consts';
import { Skin } from './types';

interface SkinItemProps {
  skin: Skin;
  showUnit: (index: number) => void;
  style?: React.CSSProperties;
}

const SkinListItem: React.FC<SkinItemProps> = ({
  skin,
  showUnit,
  style,
}) => {
  return (
    <div
      style={styles}
      className={styles.listCard}
    >
      <Row
        type="flex"
        style={{ alignItems: 'center' }}
        onClick={() => showUnit(skin.rowid)}
      >
        <Col md={2} xs={3}>
          {skin.rowid}
        </Col>
        <Col md={2} xs={5}>
          <img
            src={`${SKIN_ICO_URL}/${skin.FaceId}.png`}
            alt={skin.rowid.toString()}
            height="48"
          />
        </Col>
      </Row>
    </div>
  );
};

export default SkinListItem;
