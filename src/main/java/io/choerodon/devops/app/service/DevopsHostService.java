package io.choerodon.devops.app.service;

import java.util.Set;
import javax.annotation.Nullable;

import io.choerodon.core.domain.Page;
import io.choerodon.devops.api.vo.*;
import io.choerodon.mybatis.pagehelper.domain.PageRequest;

/**
 * @author zmf
 * @since 2020/9/15
 */
public interface DevopsHostService {
    /**
     * 创建主机
     *
     * @param projectId                 项目id
     * @param devopsHostCreateRequestVO 主机相关数据
     * @return 创建后的主机
     */
    DevopsHostVO createHost(Long projectId, DevopsHostCreateRequestVO devopsHostCreateRequestVO);

    /**
     * 批量设置主机状态为处理中
     *
     * @param projectId 项目id
     * @param hostIds   主机id数据
     */
    void batchSetStatusOperating(Long projectId, Set<Long> hostIds);

    /**
     * 异步批量校准主机状态
     *
     * @param hostIds 主机id
     */
    void asyncBatchCorrectStatus(Long projectId, Set<Long> hostIds);

    /**
     * 更新主机
     *
     * @param projectId                 项目id
     * @param hostId                    主机id
     * @param devopsHostUpdateRequestVO 主机更新相关数据
     * @return 更新后的主机
     */
    DevopsHostVO updateHost(Long projectId, Long hostId, DevopsHostUpdateRequestVO devopsHostUpdateRequestVO);

    /**
     * 查询主机
     *
     * @param projectId 项目id
     * @param hostId    主机id
     */
    DevopsHostVO queryHost(Long projectId, Long hostId);

    /**
     * 删除主机
     *
     * @param projectId 项目id
     * @param hostId    主机id
     */
    void deleteHost(Long projectId, Long hostId);

    /**
     * 测试主机连接情况
     *
     * @param projectId                  项目id
     * @param devopsHostConnectionTestVO 主机连接信息
     * @return 连接结果
     */
    DevopsHostConnectionTestResultVO testConnection(Long projectId, DevopsHostConnectionTestVO devopsHostConnectionTestVO);

    /**
     * 通过id测试部署主机连接情况
     *
     * @param projectId 项目id
     * @param hostId    主机id
     * @return true表示连接成功
     */
    Boolean testConnectionByIdForDeployHost(Long projectId, Long hostId);

    /**
     * 校验名称
     *
     * @param projectId 项目id
     * @param name      主机名称
     * @return true表示
     */
    boolean isNameUnique(Long projectId, String name);

    /**
     * ip + sshPort 是否在项目下唯一
     *
     * @param projectId 项目id
     * @param ip        主机ip
     * @param sshPort   ssh端口
     * @return true表示唯一
     */
    boolean isSshIpPortUnique(Long projectId, String ip, Integer sshPort);

    /**
     * ip + jmeterPort 是否在项目下唯一
     *
     * @param projectId  项目id
     * @param ip         主机ip
     * @param jmeterPort jmeter端口
     * @return true表示唯一
     */
    boolean isIpJmeterPortUnique(Long projectId, String ip, Integer jmeterPort);

    /**
     * 分页查询主机
     *
     * @param projectId       项目id
     * @param pageRequest     分页参数
     * @param withUpdaterInfo 是否需要更新者信息
     * @param options         查询参数
     * @return 一页主机数据
     */
    Page<DevopsHostVO> pageByOptions(Long projectId, PageRequest pageRequest, boolean withUpdaterInfo, @Nullable String options);
}
