import * as React from 'react';
import { Row, Col, Icon, Input, Spin } from 'antd';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

interface UnitListCardProps {
  card: any;
  showUnit: (cardID: number) => void;
  setTextSearcher: (search: string, event: Event) => void;
}

interface UnitListCardStates {
  active: boolean;
  success: boolean;
  conneName: string;
  nickName: string;
}

export default class UnitListCard extends React.Component<
  UnitListCardProps,
  UnitListCardStates
> {
  public state = {
    active: false,
    success: false,
    conneName: this.props.card.ConneName,
    nickName: this.props.card.NickName,
  };

  public flashSuccess = () => {
    this.setState({ success: true });
    setTimeout(() => {
      this.setState({ success: false });
    }, 1000);
  };

  public render() {
    const { card, showUnit, setTextSearcher } = this.props;
    return (
      <Row className="list-card" onClick={() => showUnit(card.CardID)}>
        <Col span={2}>{card.CardID}</Col>
        <Col span={2}>
          <span className={`gender gender-${card.Kind}`} />
        </Col>
        <Col span={2}>
          <span
            className={`rarity-circle rarity-circle-${card.Rare} filter`}
            onClick={setTextSearcher.bind(null, `稀有:${card.Rare}`)}
          />
        </Col>
        <Col span={5} className="important">
          {card.Name}
        </Col>
        <Col
          span={3}
          className="filter"
          onClick={setTextSearcher.bind(null, `种族:${card.Race}`)}
        >
          {card.Race}
        </Col>
        <Col
          span={5}
          className="filter"
          onClick={setTextSearcher.bind(
            null,
            `职业:${card.Class.ClassInit.Name}`,
          )}
        >
          {card.Class.ClassInit.Name}
        </Col>
        <Col
          span={5}
          className="filter"
          onClick={setTextSearcher.bind(null, `画师:${card.Illust}`)}
        >
          {card.Illust}
        </Col>
        <div
          className={
            `list-card-addon ` +
            (this.state.active && 'active ') +
            (this.state.success && 'success')
          }
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <Mutation
            mutation={gql`
              mutation updateCardMeta(
                $CardID: Int!
                $conneName: String
                $nickName: String
              ) {
                updateCardMeta(
                  CardID: $CardID
                  conneName: $conneName
                  nickName: $nickName
                ) {
                  ConneName
                  NickName
                }
              }
            `}
            onCompleted={this.flashSuccess}
          >
            {(updateCardMeta, { loading }) => (
              <Spin spinning={loading}>
                <Row>
                  <Col span={2}>
                    <Icon
                      onClick={() =>
                        this.setState({ active: !this.state.active })
                      }
                      style={{ cursor: 'pointer' }}
                      type={this.state.active ? 'right-circle' : 'left-circle'}
                      theme="outlined"
                    />
                  </Col>
                  <Col span={10}>
                    <span className="label">昵称:</span>
                    <Input
                      value={this.state.nickName}
                      onChange={e =>
                        this.setState({ nickName: e.target.value })
                      }
                    />
                  </Col>
                  <Col span={10}>
                    <span className="label">圆爹名:</span>
                    <Input
                      value={this.state.conneName}
                      onChange={e =>
                        this.setState({ conneName: e.target.value })
                      }
                    />
                  </Col>
                  <Col span={2}>
                    <Icon
                      type="check-circle"
                      theme="filled"
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        updateCardMeta({
                          variables: {
                            CardID: card.CardID,
                            conneName: this.state.conneName,
                            nickName: this.state.nickName,
                          },
                        })
                      }
                    />
                  </Col>
                </Row>
              </Spin>
            )}
          </Mutation>
        </div>
      </Row>
    );
  }
}
