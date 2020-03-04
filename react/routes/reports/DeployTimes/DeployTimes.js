import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { FormattedMessage } from 'react-intl';
import { Form, Select, Table } from 'choerodon-ui/pro';
import { Page, Header, Content, Breadcrumb } from '@choerodon/boot';
import { Button, Spin } from 'choerodon-ui';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';
import moment from 'moment';
import StatusTags from '../../../components/status-tag';
import LoadingBar from '../../../components/loading';
import MouserOverWrapper from '../../../components/MouseOverWrapper';
import ChartSwitch from '../Component/ChartSwitch';
import TimePicker from '../Component/TimePicker';
import NoChart from '../Component/NoChart';
import '../DeployDuration/DeployDuration.less';
import { getAxis } from '../util';
import { useReportsStore } from '../stores';
import { useDeployTimesStore } from './stores';

import MaxTagPopover from '../Component/MaxTagPopover';

import './DeployTimes.less';

const { Option } = Select;
const { Column } = Table;

const DeployTimes = observer(() => {
  const {
    AppState,
    ReportsStore,
    history,
    intl: { formatMessage },
    history: { location: { state, search } },
  } = useReportsStore();

  const {
    DeployTimesSelectDataSet,
    DeployTimesTableDataSet,
  } = useDeployTimesStore();

  const multilpleRecord = DeployTimesSelectDataSet.current;

  const [env, setEnv] = useState([]);
  const [app, setApp] = useState([]);
  const [envIds, setEnvIds] = useState([]);
  const [appId, setAppId] = useState('all');
  const [appArr, setAppArr] = useState([]);
  const [dateArr, setDateArr] = useState([]);
  const [successArr, setSuccessArr] = useState([]);
  const [failArr, setFailArr] = useState([]);
  const [allArr, setAllArr] = useState([]);
  const [dateType, setDateType] = useState('seven');

  const handleRefresh = () => {
    loadEnvCards();
    loadApps();
  };

  /**
   * 选择环境
   * @param ids 环境ID
   */
  const handleEnvSelect = (ids) => {
    if (ids) {
      setEnvIds(ids);
    } else {
      setEnvIds([]);
    }
    loadCharts();
  };

  /**
   * 选择应用
   * @param id 应用ID
   */
  const handleAppSelect = (id) => {
    setAppId(id);
    loadCharts();
  };

  useEffect(() => {
    ReportsStore.changeIsRefresh(true);
    loadEnvCards();
    loadApps();

    return () => {
      ReportsStore.setAllData([]);
      ReportsStore.setStartTime(moment().subtract(6, 'days'));
      ReportsStore.setEndTime(moment());
      ReportsStore.setStartDate();
      ReportsStore.setEndDate();
      ReportsStore.setPageInfo({ pageNum: 1, total: 0, pageSize: 10 });
    };
  }, []);

  useEffect(() => {
    if (envIds.length) {
      multilpleRecord.set('deployTimeApps', envIds.slice());
    } else {
      multilpleRecord.set('deployTimeApps', []);
    }
    if (appDom) {
      multilpleRecord.set('deployTimeName', appId);
    } else {
      multilpleRecord.set('deployTimeName', null);
    }
  }, [envIds, appId]);

  /**
   * 获取可用环境
   */
  const loadEnvCards = () => {
    const projectId = AppState.currentMenuType.id;
    let historyEnvsId = null;
    if (state && state.envIds) {
      historyEnvsId = state.envIds;
    }
    ReportsStore.loadActiveEnv(projectId)
      .then((data) => {
        const envCurrent = data && data.length ? _.filter(data, ['permission', true]) : [];
        if (envCurrent.length) {
          let selectEnv = envIds.length ? envIds : [envCurrent[0].id];
          if (historyEnvsId) {
            selectEnv = historyEnvsId;
          }
          setEnv(envCurrent);
          setEnvIds(selectEnv);
          loadCharts();
        } else {
          ReportsStore.judgeRole();
        }
      });
  };

  /**
   * 加载应用
   */
  const loadApps = () => {
    const { id } = AppState.currentMenuType;
    let historyAppId = null;
    if (state && state.appId) {
      historyAppId = state.appId;
    }
    ReportsStore.loadApps(id)
      .then((appCurrent) => {
        if (appCurrent.length) {
          let selectApp = appId || 'all';
          if (historyAppId) {
            selectApp = historyAppId;
          }
          setApp(appCurrent);
          setAppId(selectApp);
        }
      });
  };

  /**
   * 加载图表数据
   */
  const loadCharts = () => {
    const projectId = AppState.currentMenuType.id;
    const startTime = ReportsStore.getStartTime.format().split('T')[0].replace(/-/g, '/');
    const endTime = ReportsStore.getEndTime.format().split('T')[0].replace(/-/g, '/');
    const appIDCurrent = (appId === 'all') ? [] : appId;
    ReportsStore.loadDeployTimesChart(projectId, appIDCurrent, startTime, endTime, envIds.slice())
      .then((res) => {
        if (res) {
          setDateArr(res.creationDates);
          setSuccessArr(res.deploySuccessFrequency);
          setFailArr(res.deployFailFrequency);
          setAllArr(res.deployFrequencys);
        }
      });
    loadTables();
  };

  /**
   * 加载table数据
   */
  const loadTables = () => {
    const startTime = ReportsStore.getStartTime.format().split('T')[0].replace(/-/g, '/');
    const endTime = ReportsStore.getEndTime.format().split('T')[0].replace(/-/g, '/');
    const appIDCurrent = (appId === 'all') ? [] : appId;
    DeployTimesTableDataSet.setQueryParameter('appId', appIDCurrent);
    DeployTimesTableDataSet.setQueryParameter('endTime', endTime);
    DeployTimesTableDataSet.setQueryParameter('startTime', startTime);
    DeployTimesTableDataSet.setQueryParameter('envIds', envIds.slice());
    DeployTimesTableDataSet.query();
  };

  /**
   * 渲染图表
   * @returns {*}
   */
  function getOption() {
    const val = [{ name: `${formatMessage({ id: 'report.build-number.fail' })}` }, { name: `${formatMessage({ id: 'report.build-number.success' })}` }, { name: `${formatMessage({ id: 'report.build-number.total' })}` }];
    val[0].value = _.reduce(failArr, (sum, n) => sum + n, 0);
    val[1].value = _.reduce(successArr, (sum, n) => sum + n, 0);
    val[2].value = _.reduce(allArr, (sum, n) => sum + n, 0);
    const startTime = ReportsStore.getStartTime;
    const endTime = ReportsStore.getEndTime;
    const successArrCurrent = successArr ? successArr.slice() : [];
    const failArrCurrent = failArr ? failArr.slice() : [];
    const allArrCurrent = allArr ? allArr.slice() : [];
    const { xAxis, yAxis } = getAxis(startTime, endTime, dateArr ? dateArr.slice() : [], { successArrCurrent, failArrCurrent, allArrCurrent });
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none',
        },
        backgroundColor: '#fff',
        textStyle: {
          color: '#000',
          fontSize: 13,
          lineHeight: 20,
        },
        padding: [10, 15, 10, 15],
        extraCssText:
          'box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2); border: 1px solid #ddd; border-radius: 0;',
        formatter(params) {
          if (params[1].value || params[0].value) {
            const total = params[0].value + params[1].value;
            return `<div>
                <div>${formatMessage({ id: 'branch.issue.date' })}：${params[1].name}</div>
                <div><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params[1].color};"></span>${formatMessage({ id: 'appstore.deploy' })}${params[1].seriesName}：${params[1].value}</div>
                <div><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params[0].color};"></span>${formatMessage({ id: 'appstore.deploy' })}${params[0].seriesName}：${params[0].value}</div>
                <div>${formatMessage({ id: 'appstore.deploy' })}${formatMessage({ id: 'report.build-number.total' })}：${total}</div>
                <div>${formatMessage({ id: 'appstore.deploy' })}${formatMessage({ id: 'report.build-number.success.rate' })}：${((params[0].value / total) * 100).toFixed(2)}%</div>
              <div>`;
          }
        },
      },
      legend: {
        left: 'right',
        itemWidth: 14,
        itemGap: 20,
        formatter(name) {
          let count = 0;
          _.map(val, (data) => {
            if (data.name === name) {
              count = data.value;
            }
          });
          return `${name}：${count}`;
        },
        selectedMode: false,
      },
      grid: {
        left: '2%',
        right: '3%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        axisTick: { show: false },
        axisLine: {
          lineStyle: {
            color: '#eee',
            type: 'solid',
            width: 2,
          },
        },
        splitLine: {
          lineStyle: {
            color: ['#eee'],
            width: 1,
            type: 'solid',
          },
        },
        data: xAxis,
        axisLabel: {
          margin: 13,
          textStyle: {
            color: 'rgba(0, 0, 0, 0.65)',
            fontSize: 12,
          },
          formatter(value) {
            return value.slice(5, 10).replace('-', '/');
          },
        },
      },
      yAxis: {
        name: `${formatMessage({ id: 'report.build-number.yAxis' })}`,
        min: yAxis.allArrCurrent.length ? null : 0,
        max: yAxis.allArrCurrent.length ? null : 4,
        type: 'value',
        nameTextStyle: {
          fontSize: 13,
          color: '#000',
        },
        axisTick: { show: false },
        axisLine: {
          lineStyle: {
            color: '#eee',
            type: 'solid',
            width: 2,
          },
        },
        axisLabel: {
          margin: 18,
          textStyle: {
            color: 'rgba(0, 0, 0, 0.65)',
            fontSize: 12,
          },
        },
        splitLine: {
          lineStyle: {
            color: '#eee',
            type: 'solid',
            width: 1,
          },
        },
      },
      series: [
        {
          name: `${formatMessage({ id: 'report.build-number.success' })}`,
          type: 'bar',
          itemStyle: {
            color: '#00BFA5',
            emphasis: {
              shadowBlur: 10,
              shadowColor: 'rgba(0,0,0,0.20)',
            },
          },
          barWidth: '40%',
          stack: 'total',
          data: yAxis.successArrCurrent,
        },
        {
          name: `${formatMessage({ id: 'report.build-number.fail' })}`,
          type: 'bar',
          itemStyle: {
            color: '#F44336',
            emphasis: {
              shadowBlur: 10,
              shadowColor: 'rgba(0,0,0,0.20)',
            },
          },
          barWidth: '40%',
          stack: 'total',
          data: yAxis.failArrCurrent,
        },
        {
          name: `${formatMessage({ id: 'report.build-number.total' })}`,
          type: 'bar',
          color: 'transparent',
          stack: 'total',
        },
      ],
    };
  }

  /**
   * 表格函数
   * @returns {*}
   */
  function renderTable() {
    return (
      <Table
        dataSet={DeployTimesTableDataSet}
        queryBar="none"
      >
        <Column
          name="status"
          renderer={({ record }) => <StatusTags name={formatMessage({ id: record.status })} colorCode={record.status} error={record.error} />}
        />
        <Column
          name="creationDate"
        />
        <Column
          name="appServiceInstanceCode"
          renderer={({ record }) => <MouserOverWrapper text={record.appServiceInstanceCode} width={0.2}>{record.appServiceInstanceCode}</MouserOverWrapper>}
        />
        <Column
          name="appServiceName"
          renderer={({ record }) => <MouserOverWrapper text={record.appServiceName} width={0.2}>{record.appServiceName}</MouserOverWrapper>}
        />
        <Column
          name="appServiceVersion"
          renderer={({ record }) => <MouserOverWrapper text={record.appServiceVersion} width={0.2}>{record.appServiceVersion}</MouserOverWrapper>}
        />
        <Column
          name="lastUpdatedName"
        />
      </Table>
    );
  }

  const tableChange = (pagination) => {
    const startTime = ReportsStore.getStartTime.format().split('T')[0].replace(/-/g, '/');
    const endTime = ReportsStore.getEndTime.format().split('T')[0].replace(/-/g, '/');
    const appIDCurrent = (appId === 'all') ? [] : appId;
    DeployTimesTableDataSet.setQueryParameter('appId', appIDCurrent);
    DeployTimesTableDataSet.setQueryParameter('endTime', endTime);
    DeployTimesTableDataSet.setQueryParameter('startTime', startTime);
    DeployTimesTableDataSet.setQueryParameter('envIds', envIds.slice());
    DeployTimesTableDataSet.query();
  };

  const handleDateChoose = (type) => { setDateType(type); };

  const maxTagNode = (values) => <MaxTagPopover dataSource={env} value={values} />;

  const echartsLoading = ReportsStore.getEchartsLoading;
  const envData = ReportsStore.getEnvCard;
  const envs = _.filter(envData, ['permission', true]);
  const isRefresh = ReportsStore.getIsRefresh;
  const backPath = search.includes('deploy-overview')
    ? '/devops/deploy-overview'
    : '/charts';

  const envDom = env.length ? _.map(env, (d) => (<Option key={d.id} value={d.id}>{d.name}</Option>)) : null;

  const appDom = app.length ? _.map(app, (d) => (<Option key={d.id} value={d.id}>{d.name}</Option>)) : null;

  const content = (envs && envs.length ? <React.Fragment>
    <div className="c7n-report-screen c7n-report-select">
      <Form style={{ width: 620, marginRight: 60 }} dataSet={DeployTimesSelectDataSet} columns={3}>
        <Select
          searchable
          name="deployTimeApps"
          notFoundContent={formatMessage({ id: 'envoverview.noEnv' })}
          colSpan={2}
          maxTagCount={3}
          onChange={handleEnvSelect}
          maxTagPlaceholder={(omittedValues) => maxTagNode(omittedValues)}
          optionFilterProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          filter
        >
          {envDom}
        </Select>
        <Select
          colSpan={1}
          name="deployTimeName"
          notFoundContent={formatMessage({ id: 'report.no.app.tips' })}
          onChange={handleAppSelect}
          optionFilterProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          filter
        >
          {appDom}
          {appDom ? <Option key="all" value="all">{formatMessage({ id: 'report.all-app' })}</Option> : null}
        </Select>
      </Form>
      <TimePicker
        startTime={ReportsStore.getStartDate}
        endTime={ReportsStore.getEndDate}
        type={dateType}
        onChange={handleDateChoose}
        func={loadCharts}
        store={ReportsStore}
      />
    </div>
    <div className="c7n-report-content">
      <Spin spinning={echartsLoading}>
        <ReactEcharts
          option={getOption()}
          notMerge
          lazyUpdate
          style={{ height: '350px', width: '100%' }}
        />
      </Spin>
    </div>
    <div className="c7n-report-table">
      {renderTable()}
    </div>
  </React.Fragment> : <NoChart getProRole={ReportsStore.getProRole} type="env" />);

  return (<Page
    className="c7n-region"
    service={[
      'devops-service.app-service.listByActive',
      'devops-service.app-service-instance.listDeployFrequency',
      'devops-service.app-service-instance.pageDeployFrequencyDetail',
    ]}
  >
    <Header
      title={formatMessage({ id: 'report.deploy-times.head' })}
      backPath={`${backPath}${search}`}
    >
      <ChartSwitch
        history={history}
        current="deploy-times"
      />
      <Button
        icon="refresh"
        onClick={handleRefresh}
      >
        <FormattedMessage id="refresh" />
      </Button>
    </Header>
    <Breadcrumb title={formatMessage({ id: 'report.deploy-times.head' })} />
    <Content>
      {isRefresh ? <LoadingBar display={isRefresh} /> : content}
    </Content>
  </Page>);
});

DeployTimes.name = 'DeployTimes';

export default DeployTimes;
