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
sci.Provide('sci.ui.LayoutGrid');

sci.ui.LayoutGrid = function () {
    this.View = null;
    this.ShowButton = null;
};

sci.ui.LayoutGrid.prototype.Initialize = function () {
    var that = this;

    this.View = $('<div id="LayoutGrid"></div>');
    this.ShowButton = $('<div id="LayoutGridButton">Show Grid</div>');
    $('body').prepend(this.ShowButton).prepend(this.View);

    this.ShowButton.bind('click', function (e) { return that.ShowButton_Click(e); });
};

sci.ui.LayoutGrid.prototype.ShowButton_Click = function (e) {
    if (this.View.css('display') == 'block') {
        this.View.css('display', 'none');
    }
    else {
        this.View.css('display', 'block').css('height', $(document).height() + 'px');
    }

    return true;
};

sci.Ready('sci.ui.LayoutGrid');