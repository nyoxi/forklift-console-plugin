import { ICNVNetwork } from '@app/Providers/types';
import { MappingSource, MappingTarget, MappingType } from '../types';

export const getMappingSourceById = (
  sources: MappingSource[],
  id: string
): MappingSource | undefined => sources.find((source) => source.id === id);

export const getMappingSourceTitle = (mappingType: MappingType): string => {
  if (mappingType === MappingType.Network) {
    return 'Source networks';
  }
  if (mappingType === MappingType.Storage) {
    return 'Source datastores';
  }
  return '';
};

export const getMappingTargetTitle = (mappingType: MappingType): string => {
  if (mappingType === MappingType.Network) {
    return 'Target networks';
  }
  if (mappingType === MappingType.Storage) {
    return 'Target storage classes';
  }
  return '';
};

export const getMappingTargetName = (target: MappingTarget, mappingType: MappingType): string => {
  if (mappingType === MappingType.Network) {
    return (target as ICNVNetwork).name;
  }
  if (mappingType === MappingType.Storage) {
    return target as string;
  }
  return '';
};