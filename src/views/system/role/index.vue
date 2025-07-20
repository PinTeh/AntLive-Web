<template>
    <div class="role-management">
        <!-- 左侧角色管理 -->
        <div class="left-panel">
            <div class="panel-header">
                <h3>角色管理</h3>
                <a-button type="primary" @click="handleAddRole" :icon="h(PlusOutlined)">新增角色</a-button>
            </div>

            <div class="search-wrapper">
                <a-form ref="formRef" :model="formState" @finish="onFinish">
                    <a-row :gutter="16">
                        <a-col :span="16">
                            <a-form-item name="name">
                                <a-input v-model:value="formState.name" placeholder="请输入角色名称"
                                    autocomplete="off"></a-input>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-button type="primary" html-type="submit">查询</a-button>
                            <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
                        </a-col>
                    </a-row>
                </a-form>
            </div>

            <a-table :dataSource="roleDataSource" :columns="roleColumns" :pagination="rolePagination" size="small"
                @change="handleRoleTableChange" :row-class-name="getRowClassName" :custom-row="customRow">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'level'">
                        <a-tag :color="getLevelColor(record.level)">等级 {{ record.level }}</a-tag>
                    </template>
                    <template v-else-if="column.key === 'action'">
                        <span>
                            <a @click="handleEditRole(record)">编辑</a>
                            <a-divider type="vertical" />
                            <a style="color: red;" @click="handleDeleteRole(record)">删除</a>
                        </span>
                    </template>
                </template>
            </a-table>
        </div>

        <!-- 右侧菜单分配 -->
        <div class="right-panel">
            <div class="panel-header">
                <h3>菜单分配</h3>
                <div v-if="selectedRole">
                    <span>当前角色：{{ selectedRole.name }}</span>
                </div>
            </div>

            <div v-if="!selectedRole" class="empty-state">
                <a-empty description="请先选择一个角色" />
            </div>

            <div v-else class="menu-assignment">
                <div class="assignment-actions">
                    <a-button type="primary" @click="handleAssignMenu" :disabled="!hasUnassignedMenus">分配菜单</a-button>
                    <a-button @click="handleUnassignMenu" style="margin-left: 8px">取消分配</a-button>
                </div>

                <div class="menu-lists">
                    <div class="assigned-menus">
                        <h4>已分配菜单</h4>
                        <a-table :dataSource="assignedMenus" :columns="menuColumns" :pagination="false" size="small"
                            :row-selection="{ selectedRowKeys: selectedAssignedMenuKeys, onChange: onAssignedMenuSelectChange }">
                            <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'type'">
                                    <a-tag :color="record.type === 'menu' ? 'blue' : 'green'">{{ record.type === 'menu'
                                        ?
                                        '菜单' : '按钮' }}</a-tag>
                                </template>
                                <template v-if="column.key === 'action'">
                                    <a style="color: grey;" @click="handleUnassignSingleMenu(record)">取消分配</a>
                                </template>
                            </template>
                        </a-table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 新增/编辑角色模态框 -->
    <a-modal :title="roleModalTitle" :open="roleModalVisible" :confirm-loading="confirmLoading" @ok="handleRoleModalOk"
        @cancel="handleRoleModalCancel">
        <a-form ref="roleModalFormRef" :model="roleModalFormState" :rules="roleModalFormRules" :label-col="{ span: 6 }"
            :wrapper-col="{ span: 16 }">
            <a-form-item label="角色名称" name="name">
                <a-input v-model:value="roleModalFormState.name" placeholder="请输入角色名称" />
            </a-form-item>
            <a-form-item label="等级" name="level">
                <a-input-number v-model:value="roleModalFormState.level" :min="1" :max="100" placeholder="请输入等级"
                    style="width: 100%" />
            </a-form-item>
            <a-form-item label="权限描述" name="permission">
                <a-textarea v-model:value="roleModalFormState.permission" placeholder="请输入权限描述" :rows="4" />
            </a-form-item>
        </a-form>
    </a-modal>

    <!-- 分配菜单模态框 -->
    <a-modal title="分配菜单" :open="assignMenuModalVisible" :confirm-loading="assignConfirmLoading"
        @ok="handleAssignMenuModalOk" @cancel="handleAssignMenuModalCancel" width="800px">
        <a-table :dataSource="availableMenus" :columns="availableMenuColumns" :pagination="false" size="small"
            :row-selection="{ selectedRowKeys: selectedAvailableMenuKeys, onChange: onAvailableMenuSelectChange }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'type'">
                    <a-tag :color="record.type === 'menu' ? 'blue' : 'green'">{{ record.type === 'menu' ? '菜单' : '按钮'
                        }}</a-tag>
                </template>
            </template>
        </a-table>
    </a-modal>
</template>

<script setup>
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue"
import { onMounted, ref, computed, reactive, h, createVNode, watch } from "vue"
import { message, Modal } from "ant-design-vue"
import systemApi from "@/api/system"
import systemRoleApi from "@/api/system/systemRole"

const formRef = ref()
const formState = reactive({})

// 角色相关状态
const roleDataSource = ref([])
const selectedRoleKeys = ref([])
const selectedRole = ref(null)

// 角色模态框相关状态
const roleModalVisible = ref(false)
const roleModalTitle = ref("新增角色")
const confirmLoading = ref(false)
const roleModalFormRef = ref()
const editRoleId = ref(null)

// 角色表单数据
const roleModalFormState = reactive({
    name: "",
    level: 1,
    permission: "",
})

// 角色表单验证规则
const roleModalFormRules = {
    name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
    level: [{ required: true, message: "请输入等级", trigger: "blur" }],
    permission: [{ required: true, message: "请输入权限描述", trigger: "blur" }],
}

// 菜单分配相关状态
const assignedMenus = ref([])
const availableMenus = ref([])
const selectedAssignedMenuKeys = ref([])
const selectedAvailableMenuKeys = ref([])
const assignMenuModalVisible = ref(false)
const assignConfirmLoading = ref(false)

// 分页相关
const roleTotal = ref(0)
const roleCurrent = ref(1)
const rolePageSize = ref(10)
const rolePagination = computed(() => ({
    total: roleTotal.value,
    current: roleCurrent.value,
    pageSize: rolePageSize.value,
    size: "small",
}))

// 角色表格列定义
const roleColumns = ref([
    {
        title: "序号",
        dataIndex: "index",
        align: "center",
        customRender: ({ text, record, index, column }) => index + 1,
        width: 80,
    },
    {
        title: "角色名称",
        dataIndex: "name",
        key: "name",
        width: 150,
    },
    {
        title: "操作",
        key: "action",
        align: "center",
        width: 120,
    },
])

// 菜单表格列定义
const menuColumns = ref([
    {
        title: "菜单名称",
        dataIndex: "label",
        key: "label",
    },
    {
        title: "类型",
        dataIndex: "type",
        key: "type",
        width: 80,
    },
    {
        title: "路径",
        dataIndex: "path",
        key: "path",
    },
    {
        title: "操作",
        key: "action",
        align: "center",
        width: 100,
    },
])

const availableMenuColumns = ref([
    {
        title: "id",
        dataIndex: "id",
        key: "id",
    },
    {
        title: "菜单名称",
        dataIndex: "title",
        key: "title",
    },
    {
        title: "类型",
        dataIndex: "type",
        key: "type",
        width: 80,
    },
    {
        title: "路径",
        dataIndex: "path",
        key: "path",
    },
    {
        title: "父级菜单",
        dataIndex: "parentName",
        key: "parentName",
        width: 120,
    },
])

// 计算属性
const hasUnassignedMenus = computed(() => {
    return availableMenus.value.length > 0
})

// 监听选中的角色变化
watch(selectedRoleKeys, (newKeys) => {
    if (newKeys.length > 0) {
        selectedRole.value = roleDataSource.value.find(role => role.id === newKeys[0])
        getRoleMenus(newKeys[0])
    } else {
        selectedRole.value = null
        assignedMenus.value = []
    }
})

onMounted(() => {
    getRoleData()
    getAvailableMenus()
})

// 获取角色数据
const getRoleData = () => {
    const params = {
        current: roleCurrent.value,
        size: rolePageSize.value,
        name: formState.name,
    }
    systemApi.page("role", params).then(res => {
        roleDataSource.value = res.data.list
        roleTotal.value = res.data.total
    })
}

// 获取可分配的菜单列表
const getAvailableMenus = () => {
    systemApi.page("menu", {
        current: 1,
        size: 1000,
    }).then(res => {
        availableMenus.value = res.data.list
    })
}

// 获取角色已分配的菜单
const getRoleMenus = (roleId) => {
    // 模拟数据，实际应调用相关API
    let params = {
        roleId: roleId,
        pid: 0
    }
    systemRoleApi.listMenusByRole(params).then((res) => {
        assignedMenus.value = res.data
    })
}

// 表格事件处理
const handleRoleTableChange = (pag, filters, sorter) => {
    roleCurrent.value = pag.current
    rolePageSize.value = pag.pageSize
    getRoleData()
}

const onFinish = (values) => {
    console.log("Received values of form: ", values)
    getRoleData()
}

const handleReset = () => {
    formRef.value.resetFields()
    getRoleData()
}

// 角色选择事件
const onRoleSelectChange = (selectedRowKeys) => {
    selectedRoleKeys.value = selectedRowKeys
}

// 获取行样式类名
const getRowClassName = (record) => {
    return selectedRoleKeys.value.includes(record.id) ? 'selected-row' : ''
}

// 自定义行属性
const customRow = (record) => {
    return {
        style: { cursor: 'pointer' },
        onClick: () => {
            if (selectedRoleKeys.value.includes(record.id)) {
                selectedRoleKeys.value = []
            } else {
                selectedRoleKeys.value = [record.id]
            }
        }
    }
}

// 菜单选择事件
const onAssignedMenuSelectChange = (selectedRowKeys) => {
    selectedAssignedMenuKeys.value = selectedRowKeys
}

const onAvailableMenuSelectChange = (selectedRowKeys) => {
    selectedAvailableMenuKeys.value = selectedRowKeys
}

// 角色管理操作
const handleAddRole = () => {
    roleModalTitle.value = "新增角色"
    resetRoleModalForm()
    roleModalVisible.value = true
}

const handleEditRole = (record) => {
    roleModalTitle.value = "编辑角色"
    editRoleId.value = record.id
    Object.assign(roleModalFormState, {
        id: record.id,
        name: record.name,
        level: record.level,
        permission: record.permission,
    })
    roleModalVisible.value = true
}

const handleDeleteRole = (record) => {
    Modal.confirm({
        title: '确认删除吗？',
        icon: createVNode(ExclamationCircleOutlined),
        content: `删除后将无法恢复，确定删除角色 ${record.name} 吗？`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
            // 实际应调用删除API
            systemApi.delete('role', [record.id]).then(() => {
                message.success('删除成功')
                getRoleData()
            })
        },
    })
}

// 重置角色模态框表单
const resetRoleModalForm = () => {
    if (roleModalFormRef.value) {
        roleModalFormRef.value.resetFields()
    }
    editRoleId.value = null
    Object.assign(roleModalFormState, {
        id: null,
        name: "",
        level: 1,
        permission: "",
    })
}

// 角色模态框确认
const handleRoleModalOk = () => {
    roleModalFormRef.value
        .validate()
        .then(() => {
            confirmLoading.value = true
            const apiCall = systemApi.save('role', roleModalFormState)
            apiCall.then((res) => {
                if (res.code === 0) {
                    message.success(editRoleId.value ? "更新成功" : "新增成功")
                } else {
                    message.error("操作失败")
                }
                roleModalVisible.value = false
                getRoleData()
                confirmLoading.value = false
            })
        })
        .catch((err) => {
            console.log("表单验证失败:", err)
        })
}

// 角色模态框取消
const handleRoleModalCancel = () => {
    roleModalVisible.value = false
    resetRoleModalForm()
}

// 菜单分配操作
const handleAssignMenu = () => {
    assignMenuModalVisible.value = true
    selectedAvailableMenuKeys.value = []
}

const handleUnassignMenu = () => {
    if (selectedAssignedMenuKeys.value.length === 0) {
        message.warning('请选择要取消分配的菜单')
        return
    }

    Modal.confirm({
        title: '确认取消分配吗？',
        content: '确定要取消选中菜单的分配吗？',
        onOk() {
            // 实际应调用取消分配API
            message.success('取消分配成功')
            getRoleMenus(selectedRole.value.id)
            selectedAssignedMenuKeys.value = []
        },
    })
}

// 取消分配单个菜单
const handleUnassignSingleMenu = (menu) => {
    Modal.confirm({
        title: '确认取消分配',
        icon: createVNode(ExclamationCircleOutlined),
        content: `确定要取消分配菜单 "${menu.label}" 吗？`,
        okText: '确认',
        cancelText: '取消',
        okType: 'danger',
        onOk: async () => {
            try {
                // TODO: 调用后端API取消分配单个菜单
                // await systemRoleApi.unassignSingleMenu({
                //     roleId: selectedRole.value.id,
                //     menuId: menu.id
                // })

                // 模拟取消分配
                assignedMenus.value = assignedMenus.value.filter(item => item.id !== menu.id)
                message.success('取消分配成功')
            } catch (error) {
                console.error('取消分配失败:', error)
                message.error('取消分配失败')
            }
        }
    })
}

const handleAssignMenuModalOk = () => {
    if (selectedAvailableMenuKeys.value.length === 0) {
        message.warning('请选择要分配的菜单')
        return
    }

    assignConfirmLoading.value = true
    // 实际应调用分配API
    setTimeout(() => {
        message.success('分配成功')
        assignMenuModalVisible.value = false
        getRoleMenus(selectedRole.value.id)
        selectedAvailableMenuKeys.value = []
        assignConfirmLoading.value = false
    }, 1000)
}

const handleAssignMenuModalCancel = () => {
    assignMenuModalVisible.value = false
    selectedAvailableMenuKeys.value = []
}

// 工具函数
const getLevelColor = (level) => {
    if (level <= 3) return 'red'
    if (level <= 6) return 'orange'
    if (level <= 9) return 'blue'
    return 'green'
}
</script>

<style lang="scss" scoped>
.role-management {
    display: flex;
    // height: calc(100vh - 120px);
    gap: 20px;
}

.left-panel {
    // flex: 1;
    width: 500px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.right-panel {
    flex: 1;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.menu-assignment {
    height: calc(100vh - 260px);
    display: flex;
    flex-direction: column;

    .assignment-actions {
        margin-bottom: 20px;
        flex-shrink: 0;
    }

    .menu-lists {
        flex: 1;
        overflow: hidden;

        .assigned-menus {
            height: 100%;
            display: flex;
            flex-direction: column;

            h4 {
                margin-bottom: 15px;
                font-size: 16px;
                font-weight: 600;
                flex-shrink: 0;
            }

            .ant-table-wrapper {
                flex: 1;
                overflow-y: auto;
                overflow-x: hidden;
            }
        }
    }
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;

    h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
    }
}

.search-wrapper {
    margin-bottom: 20px;

    .ant-form-item {
        margin-bottom: 0;
    }
}

.empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
}

.menu-assignment {
    .assignment-actions {
        margin-bottom: 20px;
    }

    .menu-lists {
        .assigned-menus {
            h4 {
                margin-bottom: 15px;
                font-size: 16px;
                font-weight: 600;
            }
        }
    }
}

// 选中行样式
:deep(.selected-row) {
    background-color: #e6f7ff !important;

    &:hover {
        background-color: #bae7ff !important;
    }
}

// 表格行悬停效果
:deep(.ant-table-tbody > tr:hover) {
    background-color: #f5f5f5;
}

:deep(.ant-table-tbody > tr.selected-row:hover) {
    background-color: #bae7ff !important;
}
</style>