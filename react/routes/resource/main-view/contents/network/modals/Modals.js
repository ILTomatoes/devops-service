import React, { Fragment, useMemo, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from 'choerodon-ui';
import { FormattedMessage } from 'react-intl';
import HeaderButtons from '../../../../../../components/header-buttons';
import { useResourceStore } from '../../../../stores';
import { useModalStore } from './stores';
import { useNetworkStore } from '../stores';
import CreateNetwork from './network-create';
import { useMainStore } from '../../../stores';

const EnvModals = observer(() => {
  const {
    intlPrefix,
    prefixCls,
    intl: { formatMessage },
    resourceStore,
    treeDs,
  } = useResourceStore();
  const {
    networkDs,
  } = useNetworkStore();
  const {
    networkStore,
  } = useMainStore();
  const {
    permissions,
    AppState: { currentMenuType: { projectId } },
  } = useModalStore();
  const { parentId } = resourceStore.getSelectedMenu;

  const [showModal, setShowModal] = useState(false);

  function refresh() {
    treeDs.query();
    networkDs.query();
  }

  function openModal() {
    setShowModal(true);
  }

  function closeModal(isLoad) {
    setShowModal(false);
    isLoad && refresh();
  }

  const buttons = useMemo(() => ([{
    name: formatMessage({ id: `${intlPrefix}.create.network` }),
    icon: 'playlist_add',
    handler: openModal,
    display: true,
    group: 1,
    service: permissions,
  }, {
    name: formatMessage({ id: 'refresh' }),
    icon: 'refresh',
    handler: refresh,
    display: true,
    group: 1,
  }]), [formatMessage, intlPrefix, openModal, permissions, refresh]);

  return (
    <Fragment>
      <HeaderButtons items={buttons} />
      {showModal && (
        <CreateNetwork
          envId={parentId}
          visible={showModal}
          store={networkStore}
          onClose={closeModal}
        />
      )}
    </Fragment>
  );
});

export default EnvModals;
