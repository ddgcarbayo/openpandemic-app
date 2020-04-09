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

import cpy from 'rollup-plugin-cpy';
import { createCompatibilityConfig } from '@open-wc/building-rollup';

const config = createCompatibilityConfig({
  input: './index.html',
});

// if you use an array of configs, you don't need the copy task to be executed for both builds.
// we can add the plugin only to the first rollup config:
export default [
  // add plugin to the first config
  {
    ...config[0],
    plugins: [
      ...config[0].plugins,
      cpy({
        files: ['corona-app-styles.css','manifest.json','icons/**/*','data/**/*','assets/**/*'],
        dest: 'dist',
        options: {
          // parents makes sure to preserve the original folder structure
          parents: true,
        },
      }),
    ],
  },

  // leave the second config untouched
  config[1],
];