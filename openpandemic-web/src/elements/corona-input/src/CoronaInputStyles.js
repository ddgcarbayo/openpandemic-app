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
}

:host([hidden]), [hidden] {
  display: none !important;
}

*, *::before, *::after {
  box-sizing: inherit;
}

.label {
  text-align: left;
  display: block;
  margin-bottom: .5rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5rem;
  color: var(--main-color, #014582);
  cursor: default;
}

.slot-input ::slotted(input) {
  display: block;
  width: 100%;
  box-sizing: border-box;
  border: 2px solid var(--main-color, #014582);
  border-radius: 8px;
  padding: 16px;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.5rem;
  color: var(--main-color, #014582);
  outline: none;
}
.slot-input ::slotted(input)::placeholder {
  color: #4D7CA7;
  font-weight: 400;
  font-size: 1rem;
}
:host([focused]) .slot-input ::slotted(input) {
  border-color: var(--secondary-color, #25CDCE);
}
:host([invalid]) .slot-input ::slotted(input) {
  border-color: var(--highlight-color, #F35A5D);
}
`;
