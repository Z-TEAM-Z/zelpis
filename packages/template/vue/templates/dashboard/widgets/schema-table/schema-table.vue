<template>
  <div class="schema-table">
    <el-table v-if="schema && schema.properties" v-loading="loading" :data="tableData" class="table">
      <template v-for="(schemaItem, key) in schema.properties">
        <el-table-column
          v-if="schemaItem.options.visible !== false"
          :key="key"
          :prop="key"
          :label="schemaItem.label"
          v-bind="schemaItem.options"
        />
      </template>
      <el-table-column v-if="buttons?.length > 0" label="操作" fixed="right" :width="operationWidth">
        <template #default="scope">
          <el-button
            v-for="(button, index) in buttons"
            :key="index"
            link
            v-bind="button"
            @click="operationHandler({ rowData: scope.row, btnConfig: button })"
          >
            {{ button.label }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="pagination" justify="end">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 200]"
        :total="total"
        layout="total,sizes,prev,pager,next,jumper"
        @current-change="onCurrentPageChange"
        @size-change="onPageSizeChange"
      />
    </el-row>
  </div>
</template>

<script setup>
import { ref, toRefs, computed, onMounted, nextTick, watch } from 'vue';
import $curl from '../../common/curl';
import utils from '../../common/utils';

const { debounce } = utils;

const props = defineProps({
  /**
	 * schema配置, 结构如下
	 * {
			type:'object',
			properties:{
					key:{
							...schema,// 标准的shema配置
							type:'',// 字段类型
							label:'',// 字段的中文名
							// 字段在 table中的相关配置
							options:{
									...elTableColumnConfig,// 标准的el-table-column配置
									visible: true,// 是否在表单中显示,默认为true
							}
					},
					...
			}
	 */
  schema: {
    type: Object,
    required: true,
  },
  /**
   * 表格数据源APi
   */
  api: {
    type: String,
    default: '',
  },
  /**
   * 调用接口传参
   */
  apiParams: {
    type: Object,
    default: () => ({}),
  },
  /**
	 * 操作按钮相关配置，结构如下
	 * [{
  			label: '',// 按钮名称
				eventKey: '',// 按钮事件key
				eventOptions:{} // 按钮事件具体配置
				...elButtonConfig,// 标准的el-button配置
		},...]
	 */
  buttons: {
    type: Array,
    default: () => [],
  },
});
const { schema, api, buttons, apiParams } = toRefs(props);

const emit = defineEmits(['operate']);

const operationWidth = computed(() => {
  return buttons?.value?.length > 0
    ? buttons.value.reduce((pre, cur) => {
        return pre + cur.label.length * 18;
      }, 50)
    : 50;
});

const loading = ref(false);
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

onMounted(() => {
  initData();
});
watch(
  [api, schema, apiParams],
  () => {
    initData();
  },
  { deep: true }
);

const initData = () => {
  currentPage.value = 1;
  pageSize.value = 10;
  nextTick(() => {
    fetchTableData();
  });
};

const fetchTableData = debounce(async () => {
  if (!api.value) return;
  showLoading();

  // 请求table数据
  const res = await $curl({
    url: `${api.value}/list`,
    method: 'get',
    query: {
      ...apiParams.value,
      page: currentPage.value,
      pageSize: pageSize.value,
    },
  });

  hideLoading();

  if (!res || !res.success || !Array.isArray(res.data)) {
    tableData.value = [];
    total.value = 0;
    return;
  }

  tableData.value = buildTableData(res.data);
  total.value = res.metadatas?.total ?? 0;
}, 500);

/**
 * 对后端返回的数据进行渲染前的预处理
 * @param {Array} data 后端返回的数据
 */
const buildTableData = (listData) => {
  if (!schema.value?.properties) return listData;
  return listData.map((rowData) => {
    Object.keys(rowData).forEach((key) => {
      const schemaItem = schema.value.properties[key];
      // 处理toFixed
      if (schemaItem?.options?.toFixed) {
        rowData[key] = rowData[key].toFixed && rowData[key].toFixed(schemaItem.options.toFixed);
      }
    });
    return rowData;
  });
};

const showLoading = () => {
  loading.value = true;
};

const hideLoading = () => {
  loading.value = false;
};

const operationHandler = ({ rowData, btnConfig }) => {
  emit('operate', { rowData, btnConfig });
};

const onCurrentPageChange = (page) => {
  currentPage.value = page;
  fetchTableData();
};

const onPageSizeChange = (pageSize) => {
  pageSize.value = pageSize;
  fetchTableData();
};

defineExpose({
  initData,
  loadTableData: fetchTableData,
  showLoading,
  hideLoading,
});
</script>

<style lang="less" scoped>
.schema-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  .table {
    flex: 1;
  }
  .pagination {
    margin: 10px 0;
    text-align: right;
  }
}
</style>
