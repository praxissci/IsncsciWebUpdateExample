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
sci.Require('sci.patterns.observer.Observable');
sci.Require('sci.ui.SmartCell');
sci.Provide('sci.ui.IsncsciGridController');

sci.ui.IsncsciGridController = function () {
    sci.patterns.observer.Observable.call(this);

    this.View = null;
    this.IsncsciForm = null;
    this.SmartCells = null;
    this.SelectedCell = null;
};

sci.ui.IsncsciGridController.prototype.Initialize = function (view, model, isRightSide) {
    if (!view)
        throw 'sci.ui.IsncsciGridController :: A JQuery based view is required';

    if (!model)
        throw 'sci.ui.IsncsciGridController :: An IsncsciForm model is required';

    this.View = view;
    this.IsncsciForm = model;
    this.SmartCells = new Array();
    
    var rows = this.View.find('tr');
    var prickCurrent = null;
    var touchCurrent = null;
    var motorCurrent = null;
    var last = null;
    var motorIsFirst = isRightSide;

    for (var i = 0; i < rows.length; i++) {
        var level = this.IsncsciForm.GetLevelAt(i + 1);
        var cells = $(rows[i]).find('.smart-cell');
        var prickElement = cells.filter('.prick');
        var touchElement = cells.filter('.touch');
        var motorElement = cells.filter('.motor');
        var prick = prickElement.length > 0 ? new sci.ui.SmartCell(prickElement, isRightSide ? level.RightPrick : level.LeftPrick) : null;
        var touch = touchElement.length > 0 ? new sci.ui.SmartCell(touchElement, isRightSide ? level.RightTouch : level.LeftTouch) : null;
        var motor = motorElement.length > 0 ? new sci.ui.SmartCell(motorElement, isRightSide ? level.RightMotor : level.LeftMotor) : null;
        
        if (prick) {
            this.SmartCells[prick.View.attr('data-name')] = prick;
            prickCurrent = motorIsFirst ? this.ConnectSmartCell(prick, touch, null, prickCurrent, null, null, touch)
                : this.ConnectSmartCell(prick, touch, motor, prickCurrent, motor, null, touch);
        }

        if (touch) {
            this.SmartCells[touch.View.attr('data-name')] = touch;
            touchCurrent = motorIsFirst ? this.ConnectSmartCell(touch, motor ? motor : last, prick, touchCurrent, prick, null, motor)
                : this.ConnectSmartCell(touch, last, prick, touchCurrent, prick, null, null);
        }

        if (motor) {
            this.SmartCells[motor.View.attr('data-name')] = motor;
            motorCurrent = motorIsFirst ? this.ConnectSmartCell(motor, last, touch, motorCurrent, touch, null, null)
                : this.ConnectSmartCell(motor, prick, null, motorCurrent, null, null, prick);
        }

        last = motorIsFirst || !motor ? prick : motor;
    }

    var that = this;
    
    this.View.find('.smart-cell').bind('mousedown', function (e) {
        return that.Cell_MouseDown(e);
    });
    
    this.View.find('.smart-cell').bind('click', function (e) {
        return that.Cell_Clicked(e);
    });

    return this;
};

sci.ui.IsncsciGridController.prototype.ConnectSmartCell = function (smartCell, previous, next, top, right, bottom, left) {
    smartCell.Previous = previous;
    smartCell.Next = next;
    smartCell.Top = top;
    smartCell.Right = right;
    smartCell.Left = left;

    if (top)
        top.Bottom = smartCell;

    if (previous)
        previous.Next = smartCell;

    return smartCell;
};

sci.ui.IsncsciGridController.prototype.SelectCellWith = function (dermatome) {
    if (this.SelectedCell)
        this.SelectedCell.View.removeClass('selected');

    this.SelectedCell = !dermatome ? null : this.SmartCells[dermatome.Level.Name + dermatome.Side + dermatome.MeasurementType];
    
    if (this.SelectedCell)
        this.SelectedCell.View.addClass('selected');
};

sci.ui.IsncsciGridController.prototype.GetDermatomeFor = function (dataBind) {
    var cell = this.SmartCells[dataBind];

    return cell ? cell.Dermatome : null;
};

sci.ui.IsncsciGridController.prototype.GetSelectionsPreviousDermatome = function () {
    return this.SelectedCell && this.SelectedCell.Previous ? this.SelectedCell.Previous.Dermatome : null;
};

sci.ui.IsncsciGridController.prototype.GetSelectionsNextDermatome = function () {
    return this.SelectedCell && this.SelectedCell.Next ? this.SelectedCell.Next.Dermatome : null;
};

sci.ui.IsncsciGridController.prototype.GetDermatomeOnSelectionsLeft = function () {
    return this.SelectedCell && this.SelectedCell.Left ? this.SelectedCell.Left.Dermatome : null;
};

sci.ui.IsncsciGridController.prototype.GetDermatomeOnSelectionsRight = function () {
    return this.SelectedCell && this.SelectedCell.Right ? this.SelectedCell.Right.Dermatome : null;
};

sci.ui.IsncsciGridController.prototype.GetDermatomeOnSelectionsTop = function () {
    return this.SelectedCell && this.SelectedCell.Top ? this.SelectedCell.Top.Dermatome : null;
};

sci.ui.IsncsciGridController.prototype.GetDermatomeOnSelectionsBottom = function () {
    return this.SelectedCell && this.SelectedCell.Bottom ? this.SelectedCell.Bottom.Dermatome : null;
};

sci.ui.IsncsciGridController.prototype.Cell_MouseDown = function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    
    return false;
};

sci.ui.IsncsciGridController.prototype.Cell_Clicked = function (e) {
    var dermatome = this.GetDermatomeFor($(e.currentTarget).attr('data-name'));
    this.UpdateObservers({ Type: 'CellClicked', Dermatome: dermatome });

    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    
    return false;
};

sci.InheritsFromClass(sci.ui.IsncsciGridController, 'sci.patterns.observer.Observable');

sci.Ready('sci.ui.IsncsciGridController');