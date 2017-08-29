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
sci.Provide('sci.ui.DermatomeDiagramBinder');

sci.ui.DermatomeDiagramBinder = function (touch, prick, view) {
    this.View = view;
    this.Touch = touch;
    this.Prick = prick;

    this.Touch.AddObserver('Updated', this, 'Dermatome_Updated');
    this.Prick.AddObserver('Updated', this, 'Dermatome_Updated');
};

sci.ui.DermatomeDiagramBinder.prototype.GetDermatomeStyle = function (touch, prick) {
    if (touch == '0' || prick == '0')
        return 'absent';
    if (touch == '0!' || prick == '0!')
        return 'absentF';
    if (touch == '1' || prick == '1')
        return 'altered';
    if (touch == '1!' || prick == '1!')
        return 'alteredF';
    if (touch == '2' || prick == '2')
        return 'normal';

    return 'empty';
};

sci.ui.DermatomeDiagramBinder.prototype.Dermatome_Updated = function (e) {
    this.View.attr('class', 'background ' + this.GetDermatomeStyle(this.Touch.Value, this.Prick.Value));
};

sci.Ready('sci.ui.DermatomeDiagramBinder');