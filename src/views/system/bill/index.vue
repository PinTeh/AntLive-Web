<template>
    <div class="search-wrapper">
        <a-form ref="formRef" class="ant-advanced-search-form" :model="formState" @finish="onFinish">
            <a-row :gutter="24">
                <a-col :span="6">
                    <a-form-item name="typeName" label="类型名称">
                        <a-input v-model:value="formState.typeName" placeholder="请输入类型名称" autocomplete="off"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item name="label" label="标签">
                        <a-input v-model:value="formState.label" placeholder="请输入标签" autocomplete="off"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="6"></a-col>
                <a-col :span="6" style="text-align: right">
                    <a-button type="primary" html-type="submit">查询</a-button>
                    <a-button style="margin: 0 8px" @click="handleReset">重置</a-button>
                    <a v-if="showExpand" style="font-size: 12px" @click="expand = !expand">
                        <template v-if="expand">
                            <UpOutlined />
                        </template>
                        <template v-else>
                            <DownOutlined />
                        </template>
                        展开
                    </a>
                </a-col>
            </a-row>
        </a-form>
    </div>
    <div class="content-wrapper" ref="containerRef">
        <a-table :scroll="{ y: tableScrollY }" :dataSource="dataSource" :columns="columns" :pagination="false" size="small">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                </template>
            </template>
        </a-table>
        <a-pagination
            :total="total"
            :current="current"
            :page-size="pageSize"
            size="middle"
            :show-size-changer="true"
            :show-quick-jumper="true"
            :page-size-options="['10', '20', '50', '100']"
            @change="handlePageChange"
        />
    </div>
</template>

<script setup>
import { UpOutlined, DownOutlined } from "@ant-design/icons-vue"
import { onMounted, ref, reactive } from "vue"
import systemApi from "@/api/system"
import { useTableScroll } from "@/composables/useTableScroll"
import { useSearchExpand } from "@/composables/useSearchExpand"

const formRef = ref()
const { expand, showExpand } = useSearchExpand(formRef)
const formState = reactive({})
const { containerRef, tableScrollY } = useTableScroll()
const onFinish = (values) => {
    console.log("Received values of form: ", values)
    console.log("formState: ", formState)
    getData()
}

const total = ref(0)
const current = ref(1)
const pageSize = ref(10)
onMounted(() => {
    // getData()
})

const getData = () => {
    systemApi
        .page("dict", {
            pageNo: current.value,
            pageSize: pageSize.value,
            ...formState,
        })
        .then((res) => {
            total.value = res.data.total
            dataSource.value = res.data.list
        })
}

const handlePageChange = (page, size) => {
    if (size && size !== pageSize.value) {
        pageSize.value = size
    }
    current.value = page
    getData()
}

const handleReset = () => {
    formRef.value.resetFields()
    getData()
}

const dataSource = ref([])
const columns = ref([
    {
        title: "序号",
        dataIndex: "index",
        align: "center",
        customRender: ({ text, record, index, column }) => index + 1,
        width: 80,
        fixed: true,
    },
    {
        title: "类型",
        dataIndex: "type",
        key: "type",
        width: 150,
        fixed: true,
    },
    {
        title: "类型名称",
        dataIndex: "typeName",
        key: "typeName",
        width: 150,
        fixed: true,
    },
    {
        title: "标签",
        dataIndex: "label",
        key: "label",
        width: 150,
        fixed: true,
    },
    {
        title: "标签值",
        dataIndex: "value",
        key: "value",
        width: 150,
        fixed: true,
    },
    {
        title: "排序",
        dataIndex: "sort",
        key: "sort",
        sorter: (a, b) => a.sort - b.sort,
    },
    {
        title: "禁用状态",
        dataIndex: "status",
        key: "status",
    },
    {
        title: "描述",
        dataIndex: "description",
        key: "description",
    },
    {
        title: "创建时间",
        dataIndex: "createTime",
        key: "createTime",
    },
    {
        title: "操作",
        key: "action",
        align: "center",
        width: 160,
        fixed: "right",
    },
])
</script>

<style lang="scss" scoped>
.search-wrapper {
    .ant-advanced-search-form {
    .ant-form-item {
      margin-bottom: 0px;
    }

    :deep(.ant-form-item .ant-row) {
      flex-wrap: nowrap;
    }

    :deep(.ant-form-item-label) {
      width: 84px;
      text-align: right;
    }

    :deep(.ant-form-item-control) {
      flex: 1;
      min-width: 0;
    }
  }
}

.content-wrapper {
    margin-top: 20px;

    .operation-wrapper {
        margin-bottom: 20px;
        display: flex;
    }
}
</style>
