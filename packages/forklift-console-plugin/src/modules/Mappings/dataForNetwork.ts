import {
  IdOrNameRef,
  INameNamespaceRef,
  INetworkMapping,
  INetworkMappingItem,
} from 'legacy/src/queries/types';
import * as C from 'src/utils/constants';
import { useNetworkMappings } from 'src/utils/fetch';
import { groupVersionKindForObj, resolveProviderRef } from 'src/utils/resources';
import { NetworkMapResource, ProviderRef } from 'src/utils/types';

import { V1beta1Provider } from '@kubev2v/types';
import { K8sGroupVersionKind } from '@openshift-console/dynamic-plugin-sdk';

import { CommonMapping, OwnerRef, resolveOwnerRef, useMappings } from './dataCommon';

export interface FlatNetworkMapping extends CommonMapping {
  [C.FROM]: [Network, IdOrNameRef[]][];
  [C.TO]: Network[];
  [C.OBJECT]: INetworkMapping;
}

const groupMultusNetworks = (
  tuples: [INameNamespaceRef, IdOrNameRef][],
): [RemoteNetworkResource, IdOrNameRef[]][] => {
  const namespaceNameTree = tuples.reduce(
    (acc, [{ name, namespace }, source]) => ({
      ...acc,
      [namespace]: { ...acc[namespace], [name]: [...(acc[namespace]?.[name] ?? []), source] },
    }),
    {} as { [k: string]: { [l: string]: IdOrNameRef[] } },
  );
  return Object.entries(namespaceNameTree).flatMap(([namespace, nameToSrc]) =>
    Object.entries(nameToSrc).map(
      ([name, sourceNetworks]): [RemoteNetworkResource, IdOrNameRef[]] => [
        {
          name,
          namespace,
          type: 'multus',
        },
        sourceNetworks,
      ],
    ),
  );
};

export const groupByTarget = (
  networkItems: INetworkMappingItem[] = [],
): [Network, IdOrNameRef[]][] => {
  const types = networkItems.reduce(
    (acc, it) => ({
      pod: [...acc.pod, ...(it.destination.type === 'pod' ? [it] : [])],
      multus: [...acc.multus, ...(it.destination.type === 'multus' ? [it] : [])],
    }),
    {
      pod: [],
      multus: [],
    } as {
      pod: INetworkMappingItem[];
      multus: INetworkMappingItem[];
    },
  );

  const podNet: [Network, IdOrNameRef[]][] = types.pod.length
    ? [[{ name: '', type: 'pod' }, types.pod.map((it) => it.source)]]
    : [];

  return [
    ...podNet,
    ...groupMultusNetworks(
      types.multus.map(({ source, destination }): [INameNamespaceRef, IdOrNameRef] => [
        destination as INameNamespaceRef,
        source,
      ]),
    ),
  ];
};

export const mergeData = (
  mappings: NetworkMapResource[],
  providers: V1beta1Provider[],
): FlatNetworkMapping[] => {
  return mappings
    .map(
      (
        mapping,
      ): [
        NetworkMapResource,
        NetworkMapResource,
        K8sGroupVersionKind,
        ProviderRef,
        ProviderRef,
        [Network, IdOrNameRef[]][],
        OwnerRef,
      ] => [
        mapping, // to extract props
        mapping, // to pass as object blob
        groupVersionKindForObj(mapping),
        resolveProviderRef(mapping.spec.provider.source, providers),
        resolveProviderRef(mapping.spec.provider.destination, providers),
        // future improvement: resolve GVK for local networks:
        // 1. target provider needs to be local
        // 2. fetch available networks - requires 'kind' of CRDs created by Multus CNI
        groupByTarget(mapping.spec.map),
        resolveOwnerRef(mapping.metadata.ownerReferences),
      ],
    )
    .map(
      ([
        {
          metadata: { name, namespace, annotations = [] },
        },
        mapping,
        gvk,
        sourceProvider,
        targetProvider,
        groupedNetworks,
        owner,
      ]): FlatNetworkMapping => ({
        name,
        namespace,
        template: annotations?.[C.SHARED_MAPPING_ANNOTATION] !== 'false',
        gvk,
        owner: owner.name,
        ownerGvk: owner.gvk,
        source: sourceProvider.name,
        sourceGvk: sourceProvider.gvk,
        sourceResolved: sourceProvider.resolved,
        sourceReady: sourceProvider.ready,
        target: targetProvider.name,
        targetGvk: targetProvider.gvk,
        targetResolved: targetProvider.resolved,
        targetReady: targetProvider.ready,
        from: groupedNetworks,
        to: groupedNetworks.map(([to]) => to),
        object: mapping,
      }),
    )
    .filter((it) => it.template);
};

export interface LocalNetworkResource {
  gvk: K8sGroupVersionKind;
  name: string;
  namespace: string;
  type: 'multus';
}

export interface RemoteNetworkResource {
  name: string;
  namespace: string;
  type: 'multus';
}

export interface PodNetwork {
  name: '';
  type: 'pod';
}

export type Network = LocalNetworkResource | RemoteNetworkResource | PodNetwork;

export const useFlatNetworkMappings = ({
  namespace,
  name = undefined,
  groupVersionKind,
}): [FlatNetworkMapping[], boolean, boolean] => {
  return useMappings<NetworkMapResource, FlatNetworkMapping>(
    { namespace, name, groupVersionKind },
    useNetworkMappings,
    mergeData,
  );
};
