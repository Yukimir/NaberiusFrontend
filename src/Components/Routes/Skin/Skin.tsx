import React, { useEffect, useState } from 'react';
import { Button, Icon, Radio, Row, Col } from 'antd';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import useRouter from 'use-react-router';
import {
  SKIN_ICO_URL,
  SKIN_CG_URL,
  SKIN_DOT_URL,
} from 'consts';
import styles from './Skin.module.less';
import { Data, query } from './types';
import Loading from 'Components/Loading';
import { useQuery } from '@apollo/react-hooks';
import DotTable from 'Components/DotTable';
import MediaContext from 'context/MediaContext';
import classNames from 'classnames';

function getRarityName(rarity: number): string {
  switch (rarity){
    case 0: return '铁';
    case 1: return '铜';
    case 2: return '银';
    case 3: return '金';
    case 4:
    case 10: return '白';
    case 5:
    case 11: return '黑';
    case 7: return '蓝宝石';
    default: return rarity.toString();
  }
}

const SkinViewer: React.FC = () => {
  const { match } = useRouter<{ SkinIndex: string }>();
  const SkinIndex = Number.parseInt(match.params.SkinIndex, 10);

  const [currentImg, setCurrentImg] = useState('');
  const [currentText, setCurrentText] = useState<number>();

  const { isTabletOrMobile } = MediaContext.useContainer();

  const { loading, data } = useQuery<Data>(query, {
    variables: { id: SkinIndex },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data?.Skin.Image?.[0]) {
      setCurrentImg(data.Skin.Image[0]);
    }
  }, [data]);

  return (
    <div className={styles.container}>
      <Loading spinning={loading}>
        {data && !_.isEmpty(data) && (
          <div>
            <h1>皮肤序号: {data.Skin.rowid}</h1>
            <div className={styles.previewContainer}>
              <div
                className={classNames(styles.outerRadioContainer, {
                  [styles.inset]: !isTabletOrMobile,
                })}
              >
                <div className={styles.radioContainer}>
                  <Radio.Group
                    onChange={(e) => setCurrentImg(e.target.value)}
                    value={currentImg}
                    className={styles.radioGroup}
                  >
                    {data.Skin.Image.map((imgName, index) => (
                      <Radio.Button key={imgName} value={imgName}>
                        立绘
                        {Number.parseInt(imgName[imgName.length - 5], 10) + 1}
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                </div>
              </div>
              <div className={styles.outerImageContainer}>
                <div className={styles.imageContainer}>
                  {currentText !== undefined && (
                    <div
                      className={classNames(styles.textContainer, {
                        [styles.fullScreen]: isTabletOrMobile,
                      })}
                    >
                      <Button
                        ghost
                        shape="circle"
                        onClick={() => setCurrentText(undefined)}
                        className={styles.closeButton}
                      >
                        <Icon type="close" />
                      </Button>
                    </div>
                  )}
                  <img
                    style={{ height: '100%' }}
                    src={`${SKIN_CG_URL}/${currentImg}`}
                    alt={currentImg.toString()}
                  />
                </div>
              </div>
            </div>

            <div><table className={styles.table}>
              <thead><tr>
                <td>free</td>
                <td>鉄</td>
                <td>銅</td>
                <td>銀</td>
                <td>金</td>
                <td>白</td>
                <td>黒</td>
                <td>蒼</td>
              </tr></thead>
              <tbody><tr>
                <td>{data.Skin.FreeCondition}</td>
                <td><img src={`${SKIN_ICO_URL}/${data.Skin.FaceId_RarityGroup01}.png`} alt="鉄Icon" /></td>
                <td><img src={`${SKIN_ICO_URL}/${data.Skin.FaceId_RarityGroup02}.png`} alt="銅Icon" /></td>
                <td><img src={`${SKIN_ICO_URL}/${data.Skin.FaceId_RarityGroup03}.png`} alt="銀Icon" /></td>
                <td><img src={`${SKIN_ICO_URL}/${data.Skin.FaceId_RarityGroup04}.png`} alt="金Icon" /></td>
                <td><img src={`${SKIN_ICO_URL}/${data.Skin.FaceId_RarityGroup05}.png`} alt="白Icon" /></td>
                <td><img src={`${SKIN_ICO_URL}/${data.Skin.FaceId_RarityGroup06}.png`} alt="黒Icon" /></td>
                <td><img src={`${SKIN_ICO_URL}/${data.Skin.FaceId_RarityGroup08}.png`} alt="蒼Icon" /></td>
              </tr></tbody>
            </table></div>

            <div><table className={styles.table}>
              <thead><tr>
                <td>单位ID</td>
                <td>名称</td>
                <td>稀有度</td>
              </tr></thead>
              <tbody>
                {data.Skin.Units && data.Skin.Units.map((unit, index) => (
                  <tr key={index}>
                  <td><Link to={`/unit/${unit.cardID}`}>{unit.cardID}</Link></td>
                  <td>{unit.name}</td>
                  <td>{getRarityName(unit.rarity)}</td>
                  </tr>
                ))}
              </tbody>
            </table></div>

            {data.Skin.Dots && (
              <div>
                <h2>点阵</h2>
                <Row gutter={8}>
                  {data.Skin.Dots.map((dot, index) => (
                    <Col key={index} sm={24} md={12}>
                      <DotTable
                        dot={dot}
                        CardID={data.Skin.rowid}
                        urlBase={SKIN_DOT_URL}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </div>
        )}
      </Loading>
    </div>
  );
};
export default SkinViewer;
