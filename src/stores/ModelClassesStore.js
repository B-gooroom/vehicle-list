import { configure, makeAutoObservable } from 'mobx';
import axios from 'axios';
import { axiosError } from './common.js';
import _ from 'lodash';

configure({
  enforceActions: 'never',
  useProxies: 'never'
});

export default class ModelClassesStore {
  constructor() {
    makeAutoObservable(this);
  }

  modelClasses = [];
  isLoading = false;
  
  modelClassesRead(conditions) {
    this.isLoading = true;
    axios.get('https://list-by-gooroom-default-rtdb.firebaseio.com/modelClasses.json').then((response) => {
      console.log('Done modelClassesRead', response);
      let modelClasses = [];
      const modelTypes = [];
      const modelZones = [];
      const conditionModelsType = _.includes(conditions.modelTypes, true);
      const conditionModelsZone = _.includes(conditions.modelZones, true);
      response.data.map(modelClass => {
        for (let key in conditions.modelTypes) {
          if (conditions.modelTypes[key] && key === 'small' && modelClass.modelType === '경형/소형') {
            modelTypes.push(modelClass)
          }
          if (conditions.modelTypes[key] && key === 'middle' && modelClass.modelType === '준중형') {
            modelTypes.push(modelClass)
          }
          if (conditions.modelTypes[key] && key === 'large' && modelClass.modelType === '중형/대형') {
            modelTypes.push(modelClass)
          }
          if (conditions.modelTypes[key] && key === 'income' && modelClass.modelType === '수입') {
            modelTypes.push(modelClass)
          }
          if (conditions.modelTypes[key] && key === 'suv' && modelClass.modelType === 'SUV') {
            modelTypes.push(modelClass)
          }
        }
        for (let key in conditions.modelZones) {
          if (conditions.modelZones[key] && key === 'SKI' && _.includes(modelClass.modelZones.join(', '), '서울/경기/인천')) {
            modelZones.push(modelClass)
          }
          if (conditions.modelZones[key] && key === 'J' && _.includes(modelClass.modelZones.join(', '), '제주도')) {
            modelZones.push(modelClass)
          }
          if (conditions.modelZones[key] && key === 'BC' && _.includes(modelClass.modelZones.join(', '), '부산/창원')) {
            modelZones.push(modelClass)
          }
          if (conditions.modelZones[key] && key === 'TK' && _.includes(modelClass.modelZones.join(', '), '대구/경북')) {
            modelZones.push(modelClass)
          }
          if (conditions.modelZones[key] && key === 'D' && _.includes(modelClass.modelZones.join(', '), '대전')) {
            modelZones.push(modelClass)
          }
          if (conditions.modelZones[key] && key === 'G' && _.includes(modelClass.modelZones.join(', '), '광주')) {
            modelZones.push(modelClass)
          }
        }
        return undefined;
      });
      if (conditions.modelTypeTag) {
        // carTypeTags의 선택값이 있을 경우
        modelClasses = response.data.filter(modelClass => _.includes(modelClass.modelTypeTags, conditions.modelTypeTag));
      } else if (conditionModelsType && conditionModelsZone) {
        // CarModels, RegionGroups의 선택값이 모두 있을 경우 - and 조건
        modelClasses = modelTypes.filter(intersection => _.includes(modelZones, intersection));
      } else if (conditionModelsType) {
        // CarModels만 선택값이 있을 경우 - or 조건
        modelClasses = modelTypes;
      } else if (conditionModelsZone) {
        // RegionGroups만 선택값이 있을 경우 - or 조건
        modelClasses = modelZones;
      } else {
        // CarModels, RegionGroups의 선택값이 없을 때는 모두 보여줌.
        modelClasses = response.data;
      }
      this.modelClasses =  _.orderBy(modelClasses, 'modelPrice', (conditions && conditions.orderBy === 'desc' ? 'desc' : 'asc'));;
    }).catch((error) => {
      axiosError(error);
    }).finally(() => {
      this.isLoading = false;
    });
  }
}

export const modelClassesStore = new ModelClassesStore();
