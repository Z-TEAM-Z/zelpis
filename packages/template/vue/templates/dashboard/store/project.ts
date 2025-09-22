import { defineStore } from "pinia";
import { ref } from 'vue';

interface Project {
  [key: string]: any;
}

export const useProjectStore = defineStore('project', () => {
    // 项目列表 
    const projectList = ref<Project[]>([]);
    
    // 设置项目列表
    const setProjectList = (newProjectList: Project[]) => {
      projectList.value = newProjectList;
    };
    
    return { projectList, setProjectList };
});
