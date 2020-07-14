package io.choerodon.devops.infra.dto;

import javax.persistence.Table;

import io.choerodon.mybatis.annotation.ModifyAudit;
import io.choerodon.mybatis.annotation.VersionAudit;
import io.choerodon.mybatis.domain.AuditDomain;

/**
 * 〈功能简述〉
 * 〈〉
 *
 * @author wanghao
 * @since 2020/7/14 20:47
 */
@ModifyAudit
@VersionAudit
@Table(name = "devops_pipeline_record_rel")
public class DevopsPipelineRecordRelDTO extends AuditDomain {

    private Long id;

    private Long ciPipelineRecordId;

    private Long cdPipelineRecordId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCiPipelineRecordId() {
        return ciPipelineRecordId;
    }

    public void setCiPipelineRecordId(Long ciPipelineRecordId) {
        this.ciPipelineRecordId = ciPipelineRecordId;
    }

    public Long getCdPipelineRecordId() {
        return cdPipelineRecordId;
    }

    public void setCdPipelineRecordId(Long cdPipelineRecordId) {
        this.cdPipelineRecordId = cdPipelineRecordId;
    }
}
