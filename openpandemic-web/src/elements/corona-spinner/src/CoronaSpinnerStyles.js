/*
*
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import { css } from 'lit-element';

export default css`
  :host {
    display: block;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    opacity: 0;
    visibility: hidden;
    background-color: #014582;
    transition: opacity .3s, visibility 0s .3s, z-index 0s .3s;
  }

  :host([visible]) {
    z-index: 10;
    opacity: 1;
    visibility: visible;
    transition: opacity .3s, visibility 0s 0s, z-index 0s 0s;
  }

  :host([variant=light]) {
    background-color: #FFF;
  }

  :host([hidden]), [hidden] {
    display: none !important;
  }

  *, *::before, *::after {
    box-sizing: inherit;
  }

  .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 72px;
    height: 72px;
    transform: translate(-50%, -50%);
  }

  .spinner svg {
    width: 100%;
    height: 100%;
  }
`;
