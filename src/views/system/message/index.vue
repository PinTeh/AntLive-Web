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
                    <a style="font-size: 12px" @click="expand = !expand">
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
    <div class="content-wrapper">
        <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" size="small"
            @change="handleTableChange">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'status'">
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup>
import { UpOutlined, DownOutlined } from "@ant-design/icons-vue"
import { onMounted, ref, computed, reactive } from "vue"
import systemApi from "@/api/system"
import systemMessageApi from "@/api/system/systemMessage"

const expand = ref(false)
const formRef = ref()
const formState = reactive({})
const onFinish = (values) => {
    console.log("Received values of form: ", values)
    console.log("formState: ", formState)
    getData()
}

const total = ref(0)
const current = ref(1)
const pageSize = ref(10)
const pagination = computed(() => ({
    total: total.value,
    current: current.value,
    pageSize: pageSize.value,
    size: "middle",
}))

onMounted(() => {
    getData()
})

const getData = () => {
    systemMessageApi.pageDetail({
        pageNo: current.value,
        pageSize: pageSize.value,
        ...formState,
    }).then((res) => {
        total.value = res.data.total
        dataSource.value = res.data.list
    })
}

const handleTableChange = (pag, filters, sorter) => {
    current.value = pag.current
    pageSize.value = pag.pageSize
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
        title: "直播间",
        dataIndex: "roomId",
        key: "roomId",
        customRender: ({ text, record, index, column }) => `${record.roomUserNickname} 的直播间`
    },
    {
        title: "来源用户",
        dataIndex: "fromUserNickname",
        key: "fromUserNickname"
    },
    {
        title: "消息内容",
        dataIndex: "content",
        key: "content"
    },
    {
        title: "类型",
        dataIndex: "type",
        key: "type",
        customRender: ({ text, record, index, column }) => {
            if (text === 1) {
                return "正常文本"
            }
            return "撤回消息"
        }
    },
    {
        title: "状态",
        dataIndex: "status",
        key: "status"
    },
    {
        title: "创建时间",
        dataIndex: "createTime",
        key: "createTime",
        width: 200,
    }
])
</script>

<style lang="scss" scoped>
.search-wrapper {
    .ant-advanced-search-form {
        .ant-form-item {
            margin-bottom: 0px;
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
