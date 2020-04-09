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
  width: 100%;
  height: 100%;
  overflow: auto;
}

:host([hidden]), [hidden] {
  display: none !important;
}

*, *::before, *::after {
  box-sizing: inherit;
}

.page {
  position: relative;
  max-width: 792px;
  min-height: 100%;
  margin: 0 auto;
  padding: 1.5em 2em;
  display: flex;
  flex-direction: column;
}
@supports(padding: max(0px)) {
  .page {
    padding-top: max(1.5em, env(safe-area-inset-top));
    padding-bottom: max(1.5em, env(safe-area-inset-bottom));
    padding-left: max(2em, env(safe-area-inset-left));
    padding-right: max(2em, env(safe-area-inset-right));
  }
}

.sr-only {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

svg {
  width: 100%;
  height: 100%;
}

ul, ol, li, figure, p, h1, h2, h3 {
  margin: 0;
  padding: 0;
}

ol, ul {
  list-style: none;
}

li {
  position: relative;
}

li::before {
  content: '';
  position: absolute;
  top: .5rem;
  left: -1.5rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--secondary-color);
}

.figure li {
  padding-left: 72px;
  min-height: 3rem;
}
.figure li::before {
  display: none;
}
.figure li figure {
  position: absolute;
  top: 0;
  left: 0;
  width: 48px;
  height: 48px;
}

.title {
  font-family: var(--secondary-font);
  font-size: 2rem;
  font-weight: 700;
  line-height: 2rem;
  margin: 0 0 1.5rem;
}

.subtitle,
.antelead {
  font-size: 1.25rem;
  font-weight: 600;
  font-style: italic;
  line-height: 2.5rem;
  margin: 0 0 1rem;
  color: var(--secondary-color);
}

.recommendation {
  font-family: var(--secondary-font);
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 4px;
  color: var(--secondary-color);
  margin: 0 0 1.25rem;
}

li, p {
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.5rem;
  margin: 0 0 1.5rem;
}

.disclaimer {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.5rem;
  margin: 0 0 1rem;
}

.legal {
  font-size: 1rem;
  line-height: 1.25rem;
  margin: 0 0 3rem;
}

.box {
  padding: 1.5rem;
  background-color: var(--main-color);
  color: var(--light-color);
  margin: 0 0 1.25rem;
}

.box .antelead {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.5rem;
  margin: 0 0 .5rem;
  color: var(--light-color);
}

.box .title {
  font-family: inherit;
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1.5rem;
  color: var(--secondary-color);
  margin: 0 0 1rem;
}

.box.secondary {
  background-color: var(--secondary-color);
  color: var(--main-color);
}

.box.secondary .title {
  color: var(--main-color);
}

.light {
  color: var(--light-color);
}

.highlight,
.error {
  color: var(--highlight-color);
}

.error {
  font-size: 1rem;
  line-height: 1.5rem;
}

corona-button + corona-button {
  margin-top:1.5rem;
}

.submit {
  margin: 3rem 0 0;
}
`;
