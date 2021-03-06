package io.choerodon.devops.app.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import io.choerodon.core.exception.CommonException;
import io.choerodon.devops.api.vo.DevopsClusterNodeConnectionTestResultVO;
import io.choerodon.devops.api.vo.DevopsClusterNodeConnectionTestVO;
import io.choerodon.devops.app.service.DevopsClusterNodeService;
import io.choerodon.devops.infra.dto.DevopsClusterNodeDTO;
import io.choerodon.devops.infra.enums.DevopsHostStatus;
import io.choerodon.devops.infra.mapper.DevopsClusterNodeMapper;
import io.choerodon.devops.infra.util.SshUtil;

public class DevopsClusterNodeServiceImpl implements DevopsClusterNodeService {

    @Autowired
    private SshUtil sshUtil;
    @Autowired
    private DevopsClusterNodeMapper devopsClusterNodeMapper;

    @Override
    public DevopsClusterNodeConnectionTestResultVO testConnection(Long projectId, DevopsClusterNodeConnectionTestVO devopsClusterNodeConnectionTestVO) {
        DevopsClusterNodeConnectionTestResultVO result = new DevopsClusterNodeConnectionTestResultVO();
        boolean sshConnected = sshUtil.sshConnect(devopsClusterNodeConnectionTestVO.getHostIp(), devopsClusterNodeConnectionTestVO.getSshPort(), devopsClusterNodeConnectionTestVO.getAuthType(), devopsClusterNodeConnectionTestVO.getUsername(), devopsClusterNodeConnectionTestVO.getPassword());
        result.setHostStatus(sshConnected ? DevopsHostStatus.SUCCESS.getValue() : DevopsHostStatus.FAILED.getValue());
        if (!sshConnected) {
            result.setHostCheckError("failed to check ssh, please ensure network and authentication is valid");
        }
        return result;
    }

    @Override
    public void batchInsert(List<DevopsClusterNodeDTO> devopsClusterNodeDTOList) {
        int size = devopsClusterNodeDTOList.size();
        if (devopsClusterNodeMapper.batchInsert(devopsClusterNodeDTOList) != size) {
            throw new CommonException("error.batch.insert.node");
        }
    }
}
