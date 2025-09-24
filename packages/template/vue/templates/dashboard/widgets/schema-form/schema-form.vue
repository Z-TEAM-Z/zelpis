<template>
  <el-row
    v-if="schema && schema.properties"
    class="schema-form"
  >
    <template v-for="(itemSchema, key) in schema.properties">
      <component
        :is="FormItemConfig[itemSchema.options?.comType]?.component"
        v-show="itemSchema.options.visible !== false"
        ref="formComList"
        :schema-key="key"
        :schema="itemSchema"
        :model="model ? model[key] : undefined"
      />
    </template>
  </el-row>
</template>

<script setup>
import { toRefs, provide, ref } from 'vue';
import Ajv from 'ajv';
import FormItemConfig from './form-item-config';

const ajv = new Ajv({ strict: false });
provide('ajv', ajv);

// 属性
const props = defineProps({
  /**
	 * schema配置
	 * { // 板块数据结构
				type:'object',
				properties:{
						key:{
							...schema,// 标准的shema配置
							type:'',// 字段类型
							label:'',// 字段的中文名
							// 字段在 createForm 中相关配置
							options: {
									...eleComponentConfig,// 标准的el-component配置
									comType: '', // 空间类型 input/select/input-number
									visible: true, // 是否展示(true/flase), 默认为true
									disable: false, // 是否禁用
									default: '', // 默认值
									required: false, // 表单项是否必填，默认为false

									// comType === 'select' 时生效
									enumList: [], // 枚举列表
							}
						},
						...
				},
		}
	 */
  schema: Object,

  /**
   * 表单数据
   */
  model: Object,
});
const { schema } = toRefs(props);

const formComList = ref([]);

// 校验
const validate = () => {
  return formComList.value.every((component) => component.validate());
};
// 获取表单值
const getValue = () => {
  return formComList.value.reduce((dtoObj, component) => {
    return {
      ...dtoObj,
      ...component.getValue(),
    };
  }, {});
};

defineExpose({
  validate,
  getValue,
});
</script>

<style lang="less">
.schema-form {
  .form-item {
    margin-bottom: 20px;
    min-width: 500px;
    .item-label {
      margin-right: 15px;
      min-width: 70px;
      text-align: right;
      font-size: 14px;
      color: #ffffff;
      word-break: break-all;
      .required {
        top: 2px;
        padding-left: 4px;
        color: #f56c6c;
        font-size: 20px;
      }
    }
    .item-value {
      .component {
        width: 320px;
      }
      .valid-boder {
        .el-input__wrapper {
          border: 1px solid #f93f3f;
          box-shadow: 0 0 0 0;
        }
        .el-select__wrapper {
          border: 1px solid #f93f3f;
          box-shadow: 0 0 0 0;
        }
      }
    }
    .valid-tips {
      margin-left: 10px;
      height: 36px;
      line-height: 36px;
      overflow: hidden;
      font-size: 12px;
      color: #f93f3f;
    }
  }
}
</style>
