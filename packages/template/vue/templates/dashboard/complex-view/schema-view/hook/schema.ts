import { ref, watch, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useMenuStore } from '../../../store/menu';

interface SchemaProperty {
  [key: string]: any;
  options?: any;
}

interface Schema {
  type: string;
  properties: Record<string, SchemaProperty>;
  required?: string[];
}

interface SchemaConfig {
  api?: string;
  schema?: Schema;
  tableConfig?: any;
  searchConfig?: any;
  componentConfig?: Record<string, any>;
}

interface MenuItem {
  key?: string;
  schemaConfig?: SchemaConfig;
}

export const useSchema = () => {
  const route = useRoute();
  const menuStore = useMenuStore();

  const api = ref('');
  const tableSchema = ref<Schema>({} as Schema);
  const tableConfig = ref();
  const searchSchema = ref<Schema>({} as Schema);
  const searchConfig = ref();
  const components = ref<Record<string, { schema: Schema; config: any }>>({});

  // 构造shemaConfig相关配置给schema-view用
  const buildData = () => {
    const { key, sider_key } = route.query;

    const mItem = menuStore.findMenuItem({
      key: 'key',
      value: (sider_key ?? key) as string,
    });

    if (mItem && mItem.schemaConfig) {
      const { schemaConfig } = mItem;

      const configSchema = JSON.parse(JSON.stringify(schemaConfig.schema || {}));

      api.value = schemaConfig.api ?? '';

      tableSchema.value = {} as Schema;
      tableConfig.value = undefined;
      searchSchema.value = {} as Schema;
      searchConfig.value = undefined;
      components.value = {};
      nextTick(() => {
        // 构造 tableSchema 和 tableConfig
        tableSchema.value = buildDtoSchema(configSchema, 'table');
        tableConfig.value = schemaConfig.tableConfig;

        // 构造 searchSchema 和 searchConfig
        const DtoSearchSchema = buildDtoSchema(configSchema, 'search');
        for (const key in DtoSearchSchema.properties) {
          if (route.query[key] !== undefined) {
            DtoSearchSchema.properties[key].default = route.query[key];
          }
        }
        searchSchema.value = DtoSearchSchema;
        searchConfig.value = schemaConfig.searchConfig;

        // 构造 components = { comKey: { schmea: {},config: {} } }
        const { componentConfig } = schemaConfig;
        if (componentConfig && Object.keys(componentConfig).length > 0) {
          const dtoComponents: Record<string, { schema: Schema; config: any }> = {};
          for (const comName in componentConfig) {
            dtoComponents[comName] = {
              schema: buildDtoSchema(configSchema, comName),
              config: componentConfig[comName],
            };
          }
          components.value = dtoComponents;
        }
      });
    }
  };

  // 通用构建Schema方法,清除噪音
  const buildDtoSchema = (_schema: Schema, comName: string): Schema => {
    if (!_schema?.properties) return { type: 'Object', properties: {} };

    const dtoSchema: Schema = {
      type: 'Object',
      properties: {},
    };
    // 提取有效schema字段信息
    for (const key in _schema.properties) {
      const props = _schema.properties[key];
      // tableOptions就是table的配置
      if (props[`${comName}Options`]) {
        let dtoProps: SchemaProperty = {};
        // 提取props中非options部分存在dtoSchema中
        for (const pKey in props) {
          if (pKey.indexOf('Options') < 0) {
            dtoProps[pKey] = props[pKey];
          }
        }
        // 处理 comName Options
        dtoProps = Object.assign({}, dtoProps, { options: props[`${comName}Options`] });

        // 处理必填required 字段
        const { required } = _schema;
        if (required && required.find((pk) => pk === key)) {
          dtoProps.options.required = true;
        }

        dtoSchema.properties[key] = dtoProps;
      }
    }

    return dtoSchema;
  };

  watch(
    [() => route.query.key, () => route.query.sider_key, () => menuStore.menuList],
    () => {
      buildData();
    },
    { deep: true }
  );

  onMounted(() => {
    buildData();
  });

  return {
    api,
    tableSchema,
    tableConfig,
    searchSchema,
    searchConfig,
    components,
  };
};
