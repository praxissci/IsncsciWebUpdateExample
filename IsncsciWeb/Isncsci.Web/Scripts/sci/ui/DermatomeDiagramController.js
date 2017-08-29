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
sci.Require('sci.ui.DermatomeDiagramBinder');
sci.Provide('sci.ui.DermatomeDiagramController');

sci.ui.DermatomeDiagramController = function () {
    this.View = null;
    this.Binders = null;
    this.IsncsciForm = null;
    this.Diagram = null;
    this.DiagramDimensions = { Width: 206, Height: 403 };
};

sci.ui.DermatomeDiagramController.prototype.Initialize = function (view, isncsciForm) {
    if (!view)
        throw 'sci.ui.DermatomeDiagramController :: A JQuery based view is required';

    if (!isncsciForm)
        throw 'sci.ui.DermatomeDiagramController :: An IsncsciForm model is required';

    this.View = view;
    this.IsncsciForm = isncsciForm;
    this.Diagram = this.View.find('img');
    this.DiagramDimensions = {
        Width: parseInt(this.View.attr('data-width')),
        Height: parseInt(this.View.attr('data-height'))
    };

    // EE: While the ASIA Man vector work is completed, we are disabling the svg component.
    if (!Modernizr.svg) {
        return this;
    }

    var that = this;
    var url = this.View.attr('data-src');
    
    $.ajax({
        type: 'GET',
        url: url,
        success: function (data) { that.HandleSvg(data); }
    });

    return this;
};

sci.ui.DermatomeDiagramController.prototype.HandleSvg = function (data) {
    var w = this.Diagram.width();
    var h = this.Diagram.height();
    this.View.html(data);
    this.Diagram = this.View.find('svg');
    this.Binders = new Array();
    var paths = this.View.find('path[data-controller=DermatomeDiagram]');

    for (var i = 0; i < paths.length; i++) {
        var path = $(paths[i]);
        var dataBind = path.attr('data-name').split('_');
        var name = dataBind[0] === 'S45' ? 'S4_5' : dataBind[0];
        var touch = this.IsncsciForm.GetDermatomeBy(name, dataBind[1], 'Touch');
        var prick = this.IsncsciForm.GetDermatomeBy(name, dataBind[1], 'Prick');

        if (!touch || !prick) {
            alert('Could not find dermatome for path ' + dataBind[0] + ' ' + dataBind[1]);
        } else {
            this.Binders.push(new sci.ui.DermatomeDiagramBinder(touch, prick, path));
        }
    }

    this.SetDiagramDimensions(w, h);
};

sci.ui.DermatomeDiagramController.prototype.SetDiagramDimensions = function (width, height) {
    this.Diagram.width(width + 'px');
    this.Diagram.height(height + 'px');
};

sci.Ready('sci.ui.DermatomeDiagramController');