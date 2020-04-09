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
import { AutoevaluationResultPage, } from './_autoevaluation-result-page.js';

class AutoevaluationResultNoSymptomsPage extends AutoevaluationResultPage {
  get resultDataSource() {
    return 'data/pages/autoevaluation-result-page.json';
  }

  get recommendationsPage() {
    return '/recommendations-no-symptoms';
  }

  get resultSection() {
    return 'resultNoSymptoms';
  }
}

customElements.define('autoevaluation-result-no-symptoms-page', AutoevaluationResultNoSymptomsPage);
