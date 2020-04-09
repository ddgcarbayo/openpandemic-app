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
    background-color:var(--main-color);
  }

  figure {
    display: flex;
    align-items: center;
    margin-bottom: 2.5rem;
  }

  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
  }

  .column {
    --corona-card-heading-font-size: 1.5rem;
    --corona-card-heading-font-weight: 600;
    --corona-card-heading-color:var(--secondary-color);

    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    justify-content: end;
    align-items: baseline;
  }

  corona-card ul,
  h2.antelead {
    color: var(--light-color);
  }

  .mark {
    --corona-card-heading-color:var(--highlight-color);
  }

  .mark li::before {
    background-color:var(--highlight-color);
  }

  .mark .antelead {
    color:var(--highlight-color);
  }

  corona-card {
    text-transform: uppercase;
    letter-spacing: 2px;
    line-height: 1.75rem;
    margin-bottom: 4rem;

  }

  corona-card ul {
    text-transform: none;
    letter-spacing:normal;
    margin-top:1rem;
    line-height:normal;
  }

  corona-button{
    margin-top:0;
  }

  @media screen and (min-width: 800px) {
    .column {
      width: 48%;
      flex: none;
    }
  }
`;
