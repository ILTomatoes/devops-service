package script.db

databaseChangeLog(logicalFilePath: 'dba/devops_ci_maven_settings.groovy') {
    changeSet(author: 'zmf', id: '2020-04-16-create-table-maven-settings') {
        createTable(tableName: "devops_ci_maven_settings", remarks: 'ci流水线的maven_settings') {
            column(name: 'id', type: 'BIGINT UNSIGNED', remarks: '主键，ID', autoIncrement: true) {
                constraints(primaryKey: true)
            }
            column(name: 'ci_job_id', type: 'BIGINT UNSIGNED', remarks: '所属job_id')
            column(name: 'sequence', type: 'BIGINT UNSIGNED', remarks: '在job中的step中sequence数值')
            column(name: 'maven_settings', type: 'TEXT', remarks: 'maven的settings配置文件')
        }
        addUniqueConstraint(tableName: 'devops_ci_maven_settings',
                constraintName: 'uk_ci_job_id_sequence', columnNames: 'ci_job_id,sequence')
    }
}