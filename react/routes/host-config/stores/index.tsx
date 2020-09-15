import React, { createContext, useContext, useMemo } from 'react';
import { injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import { DataSet } from 'choerodon-ui/pro';
import ListDataSet from '@/routes/host-config/stores/ListDataSet';
import { DataSetSelection } from 'choerodon-ui/pro/lib/data-set/enum';
import SearchDataSet from '@/routes/host-config/stores/SearchDataSet';

interface ContextProps {
  prefixCls: string,
  intlPrefix: string,
  formatMessage(arg0: object, arg1?: object): string,
  projectId: number,
  listDs: DataSet,
  searchDs: DataSet,
}

const Store = createContext({} as ContextProps);

export function useHostConfigStore() {
  return useContext(Store);
}

export const StoreProvider = injectIntl(inject('AppState')((props: any) => {
  const {
    children,
    intl: { formatMessage },
    AppState: { currentMenuType: { projectId } },
  } = props;
  const intlPrefix = 'c7ncd.host.config';

  const statusDs = useMemo(() => new DataSet({
    data: [
      {
        text: formatMessage({ id: 'success' }),
        value: 'success',
      },
      {
        text: formatMessage({ id: 'failed' }),
        value: 'failed',
      },
    ],
    selection: 'single' as DataSetSelection,
  }), []);

  const listDs = useMemo(() => new DataSet(ListDataSet({ projectId })), [projectId]);
  const searchDs = useMemo(() => new DataSet(SearchDataSet({ projectId, statusDs })), [projectId]);

  const value = {
    ...props,
    intlPrefix,
    prefixCls: 'c7ncd-host-config',
    formatMessage,
    listDs,
    searchDs,
  };
  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}));
