/**
 * Forklift API
 * Migration toolkit for virtualization (Forklift) API definitions.
 *
 * The version of the OpenAPI document: 2.4.0
 * Contact Email: kubev2v-dev@redhat.com
 * License: Apache-2.0
 *
 * NOTE: This file is auto generated by crdtotypes (https://github.com/yaacov/crdtoapi/).
 * https://github.com/yaacov/crdtoapi/README.crdtotypes
 */

import { V1beta1MigrationStatusVmsPipelineError } from './V1beta1MigrationStatusVmsPipelineError';
import { V1beta1MigrationStatusVmsPipelineProgress } from './V1beta1MigrationStatusVmsPipelineProgress';
import { V1beta1MigrationStatusVmsPipelineTasks } from './V1beta1MigrationStatusVmsPipelineTasks';

/**
 * Pipeline step.
 *
 * @export
 */
export interface V1beta1MigrationStatusVmsPipeline {
  /** annotations
   * Annotations.
   *
   * @required {false}
   * @originalType {not defined}
   */
  annotations?: unknown | null;
  /** completed
   * Completed timestamp.
   *
   * @required {false}
   * @format {date-time}
   */
  completed?: string;
  /** description
   * Name
   *
   * @required {false}
   */
  description?: string;
  /** error
   * Error.
   *
   * @required {false}
   */
  error?: V1beta1MigrationStatusVmsPipelineError;
  /** name
   * Name.
   *
   * @required {true}
   */
  name: string;
  /** phase
   * Phase
   *
   * @required {false}
   */
  phase?: string;
  /** progress
   * Progress.
   *
   * @required {false}
   */
  progress?: V1beta1MigrationStatusVmsPipelineProgress;
  /** reason
   * Reason
   *
   * @required {false}
   */
  reason?: string;
  /** started
   * Started timestamp.
   *
   * @required {false}
   * @format {date-time}
   */
  started?: string;
  /** tasks
   * Migration task.
   *
   * @required {false}
   */
  tasks?: V1beta1MigrationStatusVmsPipelineTasks[];
}
