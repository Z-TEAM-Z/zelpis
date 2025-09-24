import _ from 'lodash';

export function mergeDsl(target: Record<string, any>, ...source: Record<string, any>[]) {
  let result = { ...target } as Record<string, any>;
  
  source.forEach((item) => {
    // Object.assign(result, item);
    result = projectExtendModel(result,item);
  });
  return result;
}

// project继承model
const projectExtendModel = (model: any,project: any)=>{
  return _.mergeWith({},model,project,(modelValue: any[],projValue: any[])=>{
      // 处理数组合并的特殊情况
      if(Array.isArray(modelValue) && Array.isArray(projValue)){
          let result = [];
          // 因为project继承model，所以需要处理的情况有
          // project有的键值，model也有 => 修改（重载）
          // project有的键值，model没有 => 新增 (拓展)
          // model 有的，project没有 => 保留（继承）

          // 处理修改和保留
          for(let i = 0; i < modelValue.length; i++){
              let modelItem = modelValue[i];
              const projItem = projValue.find(projItem=>projItem.key === modelItem.key);
              // project有的键值，model也有，则递归调用projectExtendModel 方法覆盖
              result.push(projItem?projectExtendModel(modelItem,projItem):modelItem);
          }

          // 处理新增
          for(let i = 0; i < projValue.length; i++){
              const projItem = projValue[i];
              const modelItem = modelValue.find(modelItem=>modelItem.key === projItem.key);
              if(!modelItem){
                  result.push(projItem);
              }
          }

          return result;
      }
  });
};
