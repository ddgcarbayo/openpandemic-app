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

import { css, } from 'lit-element';

export default css`
:host {
  display: block;
  position: relative;
  font: inherit;
  box-sizing: border-box;
  cursor: default;
  outline: none;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.5rem;
}

:host([hidden]), [hidden] {
  display: none !important;
}

*, *::before, *::after {
  box-sizing: inherit;
}

:host([aria-disabled=true]) {
  opacity: .4;
  cursor: default;
  pointer-events: none;
}

.container {
  display: flex;
  align-items: flex-start;
}

.box {
  flex: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  margin-right: .625rem;
  border: 2px solid var(--main-color, #014582);
  border-radius: 4px;
  transition: border-color .25s ease-in-out, background-color .25s ease-in-out;
  cursor: pointer;
}

:host(:focus) .box,
.box:hover {
  border-color: var(--secondary-color, #25CDCE);
}

:host([aria-invalid=true]) .box {
  border-color: var(--highlight-color, #F35A5D);
}

:host([aria-checked=true]) .box {
  background-color: var(--main-color, #014582);
  border-color: var(--main-color, #014582);
}

.check {
  height: 100%;
  width: 100%;
  background: url('data:image/svg+xml;utf8,<svg width="16" height="12" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M-2-4h20v20H-2z"/><path fill="rgb(37,205,206)" d="M14.39.167L5.5 9.5 1.61 5.417.5 6.583l5 5.25 1.17-1.23 8.83-9.27z"/></g></svg>') no-repeat center center;
  opacity: 0;
}

:host([aria-checked=true]) .check {
  opacity: 1;
}

.slot-control ::slotted(input[type=checkbox]) {
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
