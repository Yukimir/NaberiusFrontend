import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Icon, Drawer } from 'antd';
import { FixedSizeList as List } from 'react-window';
import gql from 'graphql-tag';
import useRouter from 'use-react-router';
import { useMediaQuery } from 'react-responsive';
import { Skin } from './types';
import SkinListItem from './SkinListItem';
import styles from './SkinList.module.less';
import Loading from '../../Loading';
import { useQuery } from '@apollo/react-hooks';
import SkinViewer from '../Skin';

const { Content } = Layout;

interface Data {
  Skins: Skin[];
}

interface Props {
  data?: Data;
  loading: boolean;
}

const SkinList: React.FC<Props> = ({ data, loading }) => {
  const [sorter, setSorter] = useState({ key: 'rowid', order: true });
  // 两个变量react-window用
  const [size, setSize] = useState({ width: 0, height: 0 });

  const { match, history } = useRouter<{ SkinIndex: string }>();
  const { SkinIndex } = match.params;

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 991px)' });

  useEffect(() => {
    const main = document.getElementsByTagName('main')[0];
    const handleResize = () => {
      const width = main.offsetWidth - 60;
      const height = main.offsetHeight - 150;
      setSize({ width, height });
    };
    window.onresize = handleResize;
    handleResize();
    return () => {
      window.onresize = null;
    };
  }, []);

  // 生成表头
  const genSorter = (title: string, key: string) => {
    return (
      <div
        style={{ cursor: 'pointer' }}
        onClick={() =>
          setSorter({ key, order: key === sorter.key ? !sorter.order : true })
        }
      >
        {title}
        {sorter.key === key && (
          <Icon type={sorter.order ? 'caret-down' : 'caret-up'} />
        )}
      </div>
    );
  };

  const showUnit = (index: number) => {
    history.push({
      pathname: `/skin/${index}`,
      state: { modal: true },
    });
  };

  const skinIdxSorter = (skinA: any, skinB: any) => {
    const { key, order } = sorter;
    return order ?
      skinA.rowid - skinB.rowid
      : skinB.rowid - skinA.rowid;
  };

  const skins = data?.Skins ? data.Skins.sort(skinIdxSorter) : [];

  return (
    <Content className={styles.unitListContent}>
      <Row>
        <Col md={4} xs={8}>
          {genSorter('#', 'rowid')}
        </Col>
      </Row>
      < div className={styles.listContainer}>
      {!loading ? (
        <List
          height={size.height}
          itemCount={skins.length}
          itemSize={68}
          width={size.width}
        >
          {({ index, style }) => (
            <div key={skins[index].rowid} style={style}>
            <SkinListItem
              skin={skins[index]}
              showUnit={showUnit}
            />
            </div>
          )}
        </List>
      ) : (
        <Loading />
      )}
      </div>
      <Drawer
        width={isTabletOrMobile ? '100%' : '80%'}
        visible={!!SkinIndex}
        destroyOnClose
        onClose={() => history.push('/skin')}
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        {SkinIndex && <SkinViewer />}
      </Drawer>
    </Content>
  );
};

const SkinListWrapper: React.FC = (props) => {
  const { data, loading } = useQuery(
    gql`
      query {
        Skins {
          rowid
          FaceId
        }
      }
    `,
  );
  return <SkinList {...props} data={data} loading={loading} />;
};

export default SkinListWrapper;
