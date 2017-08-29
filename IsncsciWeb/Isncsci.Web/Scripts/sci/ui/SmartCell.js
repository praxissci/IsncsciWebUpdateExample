/* Copyright 2014 Rick Hansen Institute
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
sci.Provide('sci.ui.SmartCell');

sci.ui.SmartCell = function (view, model) {
    this.View = view;
    this.Dermatome = model;

    this.Previous = null;
    this.Next = null;
    this.Top = null;
    this.Right = null;
    this.Bottom = null;
    this.Left = null;

    this.Dermatome.AddObserver('Updated', this, 'Dermatome_Updated');
};

sci.ui.SmartCell.prototype.Dermatome_Updated = function (e) {
    this.View.find('a').text(this.Dermatome.Value);

    if (this.Dermatome.EnteredByUser) {
        this.View.addClass('entered-by-user');
    } else {
        this.View.removeClass('entered-by-user');
    }
};

sci.Ready('sci.ui.SmartCell');