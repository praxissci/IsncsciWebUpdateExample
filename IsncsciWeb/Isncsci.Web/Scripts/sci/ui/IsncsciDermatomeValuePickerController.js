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
sci.Provide('sci.ui.IsncsciDermatomeValuePickerController');

sci.ui.IsncsciDermatomeValuePickerController = function () {
    this.Value = '';
    this.HasFlag = false;
};

sci.ui.IsncsciDermatomeValuePickerController.prototype.Initialize = function (view) {
    if (!view)
        throw 'sci.ui.IsncsciDermatomeValuePickerController :: A JQuery based view is required';

    this.View = view;
    var bindings = this.View.find('*[data-controller=ValuePicker]');
    this.ValueButtons = bindings.filter('*[data-name=ValueButton]');
    this.DermatomeName = bindings.filter('*[data-name=DermatomeName]');

    return this;
};

sci.ui.IsncsciDermatomeValuePickerController.prototype.PrepareForDisplay = function(dermatomeName, value, hasFlag) {
    var that = this;

    this.DermatomeName.text(dermatomeName);
    this.ValueButtons.bind('click', function (e) { return that.ValueButton_Click(e); });
    this.SetValue(value, hasFlag);
};

sci.ui.IsncsciDermatomeValuePickerController.prototype.SetValue = function (value) {
    this.Value = value;
    this.HasFlag = /(\*|!)/g.test(value);
    var valueWithNoFlag = value.replace(/(\*|!)/g, '');
    this.ValueButtons.removeClass('selected');

    for (var i = 0; i < this.ValueButtons.length; i++) {
        var button = $(this.ValueButtons[i]);
        var buttonValue = button.attr('data-value');
        
        if (buttonValue == value || buttonValue == valueWithNoFlag)
            button.addClass('selected');
    }

    // If no flag, no need to continue
    if (!this.HasFlag)
        return;
};

sci.ui.IsncsciDermatomeValuePickerController.prototype.ValueButton_Click = function (e) {
    this.SetValue($(e.currentTarget).attr('data-value'));
    
    return true;
};

sci.Ready('sci.ui.IsncsciDermatomeValuePickerController');