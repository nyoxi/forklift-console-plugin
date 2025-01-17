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

/**
 * Destination network.
 *
 * @export
 */
export interface V1beta1NetworkMapSpecMapDestination {
  /** name
   * The name.
   *
   * @required {false}
   */
  name?: string;
  /** namespace
   * The namespace (multus only).
   *
   * @required {false}
   */
  namespace?: string;
  /** type
   * The network type.
   *
   * @required {true}
   * @originalType {string}
   */
  type: 'pod' | 'multus';
}
