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
  section {
    overflow:hidden;
    border-radius: 8px;
  }

  section:not(.next):not(.intro){
    margin-bottom: 2rem;
    padding: 2em 1em 0 1em;
  }

 .next {
  padding: 0.5em;
 }

  .next.line {
    border: 2px solid var(--secondary-color);
  }

  .next p {
    margin: 0;
    letter-spacing: 2;
    line-height: 1.4;
  }

  .next corona-button {
    margin-top: 1rem;
  }

  time {
    font-style: italic;
  }

  hr {
    display: flex;
    border: none;
    margin-bottom: 1.5rem;
  }
  hr::before,
  hr::after {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--secondary-color);
  }

  hr::after {
    margin-left: .5rem;
    background-color: var(--highlight-color);
  }
  .result-disclaimer {
    font-style: italic;
    font-size: 1rem;
    line-height: 1.25rem;
  }
`;
