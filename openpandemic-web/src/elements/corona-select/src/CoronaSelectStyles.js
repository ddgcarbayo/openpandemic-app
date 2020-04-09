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
  position: relative;
  box-sizing: border-box;
}

:host([hidden]),
[hidden] {
  display: none !important;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

.label {
  text-align: left;
  display: block;
  margin-bottom: .5rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5rem;
  color: var(--main-color, #014582);
  cursor: default;
}

.slot-select ::slotted(select) {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  display: block;
  width: 100%;
  height: 4rem;
  box-sizing: border-box;
  border: 2px solid var(--main-color, #014582);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.5rem;
  color: var(--main-color, #014582);
  outline: none;
  cursor: pointer;
  background-image: url('data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.3137 9L11.6569 14.6569L6 9" stroke="rgb(85,85,85)" stroke-width="2"/></svg>');
  background-repeat: no-repeat, repeat;
  background-position: right .7em top 50%,0 0;
}
:host([focused]) .slot-select ::slotted(select) {
  border-color: var(--secondary-color, #25CDCE);
}
:host([invalid]) .slot-select ::slotted(select) {
  border-color: var(--highlight-color, #F35A5D)
}
`;
