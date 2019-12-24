import React, { useState } from 'react';
import { Layout, Spin, Pagination, Input } from 'antd';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { ClassData } from 'interfaces';
import ClassTable from 'Components/ClassTable';

const { Content } = Layout;

const ClassList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSetSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const classFilter = (unitClass: any) => {
    return JSON.stringify(unitClass).includes(search);
  };

  const { data, loading, refetch } = useQuery<{ Classes: ClassData[] }>(gql`
    query {
      Classes {
        ClassID
        Name
        Explanation
        JobChange
        JobChangeMaterial1
        JobChangeMaterial2
        JobChangeMaterial3
        Data_ExtraAwakeOrb1
        Data_ExtraAwakeOrb2
        AwakeType1
        AwakeType2
        AttackWait
        NickNames
        ClassAbilityConfigs {
          _InvokeType
          _TargetType
          _InfluenceType
          _Param1
          _Param2
          _Param3
          _Param4
          _Command
          _ActivateCommand
        }
        ClassAbilityPower1
        Cards {
          CardID
          Name
          Rare
        }
      }
    }
  `);

  return (
    <Content className="container">
      <Spin spinning={loading}>
        <Input
          placeholder="搜索职业"
          value={search}
          onChange={event => {
            handleSetSearch(event.target.value);
          }}
        />
        {data &&
          data.Classes &&
          data.Classes.filter(classFilter)
            .sort((c1, c2) => c1.ClassID - c2.ClassID)
            .slice(50 * (currentPage - 1), 50 * currentPage)
            .map(unitClass => {
              return (
                <ClassTable
                  key={unitClass.ClassID}
                  classData={unitClass}
                  onCompleted={refetch}
                />
              );
            })}
        {data && data.Classes && (
          <Pagination
            defaultCurrent={1}
            defaultPageSize={50}
            current={currentPage}
            onChange={page => setCurrentPage(page)}
            total={data.Classes.filter(classFilter).length}
          />
        )}
      </Spin>
    </Content>
  );
};

export default ClassList;
