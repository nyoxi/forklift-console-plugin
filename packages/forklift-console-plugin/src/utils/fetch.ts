import { useMemo } from 'react';
import {
  MigrationResource,
  NetworkMapResource,
  PlanResource,
  StorageMapResource,
} from 'src/utils/types';

import {
  MOCK_NETWORK_MAPPINGS,
  MOCK_STORAGE_MAPPINGS,
} from '@kubev2v/legacy/queries/mocks/mappings.mock';
import { MOCK_MIGRATIONS } from '@kubev2v/legacy/queries/mocks/migrations.mock';
import { MOCK_PLANS } from '@kubev2v/legacy/queries/mocks/plans.mock';
import { MOCK_CLUSTER_PROVIDERS } from '@kubev2v/legacy/queries/mocks/providers.mock';
import { V1beta1Provider } from '@kubev2v/types';
import {
  K8sGroupVersionKind,
  K8sResourceCommon,
  useK8sWatchResource,
  WatchK8sResource,
  WatchK8sResult,
} from '@openshift-console/dynamic-plugin-sdk';

import { ResourceKind } from './resources';

const IS_MOCK = process.env.DATA_SOURCE === 'mock';

function createRealK8sWatchResourceHook<T>(kind: string) {
  return function useRealHook(
    { namespace, name }: WatchK8sResource,
    { group, version }: Omit<K8sGroupVersionKind, 'kind'>,
  ): WatchK8sResult<T[]> {
    return useK8sWatchResource<T[]>({
      groupVersionKind: {
        group,
        version,
        kind,
      },
      isList: true,
      namespaced: true,
      namespace,
      name,
    });
  };
}

const useMockProviders = ({ name }: WatchK8sResource): WatchK8sResult<V1beta1Provider[]> => {
  const mockData: V1beta1Provider[] = useMemo(
    () =>
      !name
        ? (MOCK_CLUSTER_PROVIDERS as V1beta1Provider[])
        : (MOCK_CLUSTER_PROVIDERS?.filter(
            (provider) => provider?.metadata?.name === name,
          ) as V1beta1Provider[]),
    [name],
  );
  return [mockData, true, false];
};

export const useProviders = IS_MOCK
  ? useMockProviders
  : createRealK8sWatchResourceHook<V1beta1Provider>('Provider');

const useMockPlans = ({ name }: WatchK8sResource): WatchK8sResult<PlanResource[]> => {
  const mockData: PlanResource[] = useMemo(
    () =>
      !name
        ? (MOCK_PLANS as PlanResource[])
        : (MOCK_PLANS?.filter((plan) => plan?.metadata?.name === name) as PlanResource[]),
    [name],
  );
  return [mockData, true, false];
};

const useMockMigrations = ({ name }: WatchK8sResource): WatchK8sResult<MigrationResource[]> => {
  const mockData: MigrationResource[] = useMemo(
    () =>
      !name
        ? (MOCK_MIGRATIONS as MigrationResource[])
        : (MOCK_MIGRATIONS?.filter(
            (migration) => migration?.metadata?.name === name,
          ) as MigrationResource[]),
    [name],
  );
  return [mockData, true, false];
};

const useMockNetworkMappings = ({
  name,
}: WatchK8sResource): WatchK8sResult<NetworkMapResource[]> => {
  const mockData: NetworkMapResource[] = useMemo(
    () =>
      !name
        ? (MOCK_NETWORK_MAPPINGS as NetworkMapResource[])
        : (MOCK_NETWORK_MAPPINGS?.filter(
            (map) => (map as K8sResourceCommon)?.metadata?.name === name,
          ) as NetworkMapResource[]),
    [name],
  );
  return [mockData, true, false];
};

const useMockStorageMappings = ({
  name,
}: WatchK8sResource): WatchK8sResult<StorageMapResource[]> => {
  const mockData: StorageMapResource[] = useMemo(
    () =>
      !name
        ? (MOCK_STORAGE_MAPPINGS as StorageMapResource[])
        : (MOCK_STORAGE_MAPPINGS?.filter(
            (map) => (map as K8sResourceCommon)?.metadata?.name === name,
          ) as StorageMapResource[]),
    [name],
  );
  return [mockData, true, false];
};

export const usePlans = IS_MOCK
  ? useMockPlans
  : createRealK8sWatchResourceHook<PlanResource>(ResourceKind.Plan);

export const useMigrations = IS_MOCK
  ? useMockMigrations
  : createRealK8sWatchResourceHook<MigrationResource>(ResourceKind.Migration);

export const useNetworkMappings = IS_MOCK
  ? useMockNetworkMappings
  : createRealK8sWatchResourceHook<NetworkMapResource>(ResourceKind.NetworkMap);

export const useStorageMappings = IS_MOCK
  ? useMockStorageMappings
  : createRealK8sWatchResourceHook<StorageMapResource>(ResourceKind.StorageMap);
