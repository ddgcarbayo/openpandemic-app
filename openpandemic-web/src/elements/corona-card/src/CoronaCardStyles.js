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

import { css, unsafeCSS } from 'lit-element';

export default css`:host {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  flex-direction: column;
  color: var(--corona-card-color, var(--colorsSecondary600, #121212}));
  padding: calc(((2 * var(--gridSpacerVariant, var(--gridSpacer, 8))) / 16) * 1rem); }

:host([hidden]), [hidden] {
  display: none !important; }

*, *:before, *:after {
  box-sizing: inherit; }

.image {
  max-height: var(--corona-card-image-size, 5rem);
  max-width: var(--corona-card-image-size, 5rem);
  margin-bottom: calc(((2 * var(--gridSpacerVariant, var(--gridSpacer, 8))) / 16) * 1rem); }

.heading {
  font-size: var(--corona-card-heading-font-size, var(--typographyType3XLarge, 1.15rem));
  font-weight: var(--corona-card-heading-font-weight, var(--fontFacePrimaryMediumFontWeight, 500));
  margin-bottom: calc(((1 * var(--gridSpacerVariant, var(--gridSpacer, 8))) / 16) * 1rem);
  color: var(--corona-card-heading-color, #121212);

   }

.content {
  font-size: var(--corona-card-slotted-font-size, var(--typographySmall, 1rem));
  font-weight: var(--corona-card-slotted-font-weight, var(--fontFacePrimaryBookFontWeight, 400));
  line-height: var(--corona-card-slotted-line-height, var(--lineHeightTypeSmall, 1.5rem));
  color: var(--corona-card-color, var(--colorsSecondary600, #121212));
 }
`;
