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
  font: inherit;
  box-sizing: border-box;
  height: 4rem;
  border-radius: 8px;
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-weight: 400;
  color: var(--main-color, #014582);
  border: 2px solid var(--tertiary-color, #DFE9F2);
  padding: 0 1.5rem;
  outline: none;
  cursor: pointer;
}

:host([hidden]), [hidden] {
  display: none !important;
}

*, *::before, *::after {
  box-sizing: inherit;
}

:host(:focus) {
  border: 2px solid var(--secondary-color, #25CDCE);
}

:host([aria-checked=true]) {
  font-weight: 700;
  background-color: #A7EBEB;
  border-color: #A7EBEB;
}

:host([aria-disabled=true]) {
  opacity: .4;
  cursor: default;
  pointer-events: none;
}

.container {
  display: flex;
  align-items: center;
  height: 100%;
}

.radio {
  flex: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 1rem;
  border-radius: 50%;
  background-color: var(--light-color, #fff);
  border: 2px solid var(--main-color, #014582);
}

:host([aria-checked=true]) .radio {
  background-color: var(--main-color, #014582);
  border: none;
}

.check {
  display: block;
  width: .5rem;
  height: .5rem;
  background-color: var(--secondary-color, #25CDCE);
  border-radius: 50%;
  opacity: 0;
}

:host([aria-checked=true]) .check {
  opacity: 1;
}

.slot-control ::slotted(input[type=radio]) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  z-index: -1;
  pointer-events: none;
}
`;
