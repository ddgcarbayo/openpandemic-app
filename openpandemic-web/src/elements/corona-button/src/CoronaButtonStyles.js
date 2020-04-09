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
  display: inline-flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  position: relative;
  font: inherit;
  text-align: center;
  user-select: none;
  cursor: pointer;
  outline: none;
  min-width: 184px;
  height: 4rem;
  margin-top: 3rem;
  padding: 0 1.5rem;
  border: 2px solid transparent;
  border-radius: 8px;
  background-color: var(--main-color, #014582);
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 700;
  color: var(--light-color, #fff);
  vertical-align: bottom;
}
:host([hidden]), [hidden] {
  display: none !important;
}
*, *::before, *::after {
  box-sizing: inherit;
}
:host(:focus) {
  outline: #5e9ed6 auto 5px;
}
.spinner {
  height: 3rem;
}
.spinner svg {
  height: 100%;
}

/* Button */
@media only screen and (max-width: 480px){
  :host {
    display: flex;
    width: 100%;
  }
}

/* States */
:host([loading]),
:host([aria-disabled=true]) {
  cursor: default;
  pointer-events: none;
}
:host([aria-disabled=true]) {
  opacity: .4;
}
:host(:active),
:host([active]) {
  background-color: #00374d;
}

/* Variants */
:host([variant=light]) {
  background-color: var(--light-color, #fff);
  color:var(--main-color, #014582);
}
:host([variant=light]:focus) {
  outline: var(--light-color, #fff) auto 5px;
}
:host([variant=light]:active),
:host([variant=light][active]) {
  background-color: var(--tertiary-color, #DFE9F2);
}
:host([variant=contrast]) {
  background-color: transparent;
  color:var(--secondary-color, #25CDCE);
}
:host([variant=contrast]:active),
:host([variant=contrast][active]) {
  background-color: var(--tertiary-color, #DFE9F2);
}

/* Link */
:host([href]),
:host([link]) {
  display: inline-block;
  min-width: 0;
  width: auto;
  height: auto;
  margin: 0;
  padding: 0;
  border: none;
  background-color: transparent;
  color: var(--secondary-color, #25CDCE);
  font-size: inherit;
  line-height: inherit;
  font-weight: 400;
  text-align: left;
  text-decoration: underline;
}
:host([href][aria-disabled=true]),
:host([link][aria-disabled=true]) {
  opacity: 1;
  cursor: default;
  text-decoration: none;
  color: currentColor;
}
:host([href][active]),
:host([link][active]) {
  background-color: transparent;
  color: var(--main-color, #014582);
}

`;
