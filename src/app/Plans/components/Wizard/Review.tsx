import * as React from 'react';
import {
  TextContent,
  Text,
  Grid,
  GridItem,
  Form,
  Popover,
  Button,
  List,
} from '@patternfly/react-core';
import spacing from '@patternfly/react-styles/css/utilities/Spacing/spacing';
import { PlanWizardFormState } from './PlanWizard';
import MappingDetailView from '@app/Mappings/components/MappingDetailView';
import { IPlan, IVMwareVM, Mapping, MappingType, POD_NETWORK } from '@app/queries/types';
import { MutationResult } from 'react-query';
import { IKubeResponse, KubeClientError } from '@app/client/types';
import { QuerySpinnerMode, ResolvedQueries } from '@app/common/components/ResolvedQuery';
import { generateMappings } from './helpers';
import { usePausedPollingEffect } from '@app/common/context';
import { useNamespacesQuery } from '@app/queries/namespaces';

interface IReviewProps {
  forms: PlanWizardFormState;
  allMutationResults: (
    | MutationResult<IKubeResponse<IPlan>, KubeClientError>
    | MutationResult<IKubeResponse<Mapping>, KubeClientError>
  )[];
  allMutationErrorTitles: string[];
  planBeingEdited: IPlan | null;
  selectedVMs: IVMwareVM[];
}

const Review: React.FunctionComponent<IReviewProps> = ({
  forms,
  allMutationResults,
  allMutationErrorTitles,
  planBeingEdited,
  selectedVMs,
}: IReviewProps) => {
  usePausedPollingEffect();

  const { networkMapping, storageMapping } = generateMappings({ forms });

  const namespacesQuery = useNamespacesQuery(forms.general.values.targetProvider);
  const namespaceOptions = namespacesQuery.data?.map((namespace) => namespace.name) || [];
  const isNewNamespace = !namespaceOptions.find(
    (namespace) => namespace === forms.general.values.targetNamespace
  );

  return (
    <Form>
      <TextContent>
        <Text component="p">
          Review the information below and click Finish to {!planBeingEdited ? 'create' : 'save'}{' '}
          your migration plan. Use the Back button to make changes.
        </Text>
      </TextContent>
      <Grid hasGutter className={`${spacing.mtSm} ${spacing.mbMd}`}>
        <GridItem md={12}></GridItem>
        <GridItem md={3}>Plan name</GridItem>
        <GridItem md={9}>{forms.general.values.planName}</GridItem>
        {forms.general.values.planDescription ? (
          <>
            <GridItem md={3}>Plan description</GridItem>
            <GridItem md={9}>{forms.general.values.planDescription}</GridItem>
          </>
        ) : null}
        <GridItem md={3}>Source provider</GridItem>
        <GridItem md={9}>{forms.general.values.sourceProvider?.name}</GridItem>
        <GridItem md={3}>Target provider</GridItem>
        <GridItem md={9}>{forms.general.values.targetProvider?.name}</GridItem>
        <GridItem md={3}>Target namespace</GridItem>
        <GridItem md={9}>
          {forms.general.values.targetNamespace}
          {isNewNamespace ? (
            <TextContent>
              <Text component="small">
                This is a new namespace that will be created when the plan is started.
              </Text>
            </TextContent>
          ) : null}
        </GridItem>
        <GridItem md={3}>Migration transfer network</GridItem>
        <GridItem md={9}>{forms.general.values.migrationNetwork || POD_NETWORK.name}</GridItem>
        <GridItem md={3}>Selected VMs</GridItem>
        <GridItem md={9}>
          <Popover
            headerContent={<div>Selected VMs</div>}
            bodyContent={
              <List>
                {selectedVMs.map((vm, index) => (
                  <li key={index}>{vm.name}</li>
                ))}
              </List>
            }
          >
            <Button variant="link" isInline>
              {selectedVMs.length}
            </Button>
          </Popover>
        </GridItem>
        <GridItem md={3}>Network mapping</GridItem>
        <GridItem md={9}>
          <MappingDetailView mappingType={MappingType.Network} mapping={networkMapping} />
        </GridItem>
        <GridItem md={3}>Storage mapping</GridItem>
        <GridItem md={9}>
          <MappingDetailView mappingType={MappingType.Storage} mapping={storageMapping} />
        </GridItem>
        <GridItem md={3}>Migration type</GridItem>
        <GridItem md={9}>{forms.type.values.type}</GridItem>
      </Grid>
      <ResolvedQueries
        results={allMutationResults}
        errorTitles={allMutationErrorTitles}
        spinnerMode={QuerySpinnerMode.Inline}
      />
    </Form>
  );
};

export default Review;
