package script.db

databaseChangeLog(logicalFilePath: 'dba/devops_ci_job_record.groovy') {
    changeSet(author: 'wanghao', id: '2020-04-02-create-table') {
        createTable(tableName: "devops_ci_job_record", remarks: 'devops_ci_job_record') {
            column(name: 'id', type: 'BIGINT UNSIGNED', remarks: '主键，ID', autoIncrement: true) {
                constraints(primaryKey: true)
            }
            column(name: 'gitlab_job_id', type: 'BIGINT UNSIGNED', remarks: 'gitlab job id')
            column(name: 'gitlab_pipeline_id', type: 'BIGINT UNSIGNED', remarks: 'gitlab_流水线记录id')
            column(name: 'name', type: 'VARCHAR(255)', remarks: '任务名称')
            column(name: 'stage', type: 'VARCHAR(255)', remarks: '所属阶段名称')
            column(name: 'status', type: 'VARCHAR(255)', remarks: 'job状态')
            column(name: 'trigger_user_id', type: 'BIGINT UNSIGNED', remarks: '触发用户id')
            column(name: "started_date", type: "DATETIME", remarks: 'job开始执行时间')
            column(name: "finished_date", type: "DATETIME", remarks: 'job结束时间')
            column(name: "duration_seconds", type: "BIGINT UNSIGNED", remarks: 'job执行时长')

            column(name: "object_version_number", type: "BIGINT UNSIGNED", defaultValue: "1")
            column(name: "created_by", type: "BIGINT UNSIGNED", defaultValue: "0")
            column(name: "creation_date", type: "DATETIME", defaultValueComputed: "CURRENT_TIMESTAMP")
            column(name: "last_updated_by", type: "BIGINT UNSIGNED", defaultValue: "0")
            column(name: "last_update_date", type: "DATETIME", defaultValueComputed: "CURRENT_TIMESTAMP")
        }
        addUniqueConstraint(tableName: 'devops_ci_job_record',
                constraintName: 'uk_gitlab_job_id', columnNames: 'gitlab_job_id')
    }
}