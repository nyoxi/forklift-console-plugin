import React from 'react';

import { ToolbarGroup } from '@patternfly/react-core';

import { FilterFromDef } from './FilterFromDef';
import { MetaFilterProps } from './types';

/**
 * Implementation of PatternFly 4 filter group pattern.
 * Extended to use any filter matching FilterTypeProps interface(not only enum based selection).
 *
 * @see FilterTypeProps
 */
export const FilterGroup = ({
  selectedFilters,
  onFilterUpdate,
  fieldFilters,
  supportedFilterTypes = {},
}: MetaFilterProps) => (
  <ToolbarGroup variant="filter-group">
    {fieldFilters.map(({ fieldId, toFieldLabel, filterDef }) => (
      <FilterFromDef
        key={fieldId}
        {...{
          fieldId,
          toFieldLabel,
          filterDef,
          onFilterUpdate,
          selectedFilters,
          FilterType: supportedFilterTypes[filterDef.type],
        }}
      />
    ))}
  </ToolbarGroup>
);
