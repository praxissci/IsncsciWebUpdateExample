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
sci.Provide('sci.ui.IsncsciTotalsController');

sci.ui.IsncsciTotalsController = function () {
    this.View = null;
    this.TestTotals = null;
    this.ShowAll = null;
    this.AllTotals = null;
    this.TotalsTemplate = null;
    this.RangeRegex = new RegExp('(,|-)');
};

sci.ui.IsncsciTotalsController.prototype.Initialize = function (view) {
    if (!view)
        throw 'sci.ui.IsncsciTotalsController :: A JQuery based view is required';

    this.View = view;
    var jqueryHelper = this.View.find('[data-controller=IsncsciTotals]');
    this.TestTotals = jqueryHelper.filter('[data-name=TestTotals]');
    this.ShowAll = jqueryHelper.filter('[data-name=ShowAll]');
    this.AllTotals = jqueryHelper.filter('[data-name=AllTotals]');
    this.TotalsTemplate = $(jqueryHelper.filter('[data-name=TotalsTemplate]').html());

    this.TotalsTemplate.clone().appendTo(this.TestTotals);
    
    this.RangeDialog = jqueryHelper.filter('[data-name=RangeDialog]');
    this.RangeDialogContent = jqueryHelper.filter('[data-name=RangeDialogContent]');
    
    this.RightUpperMotorTotal = jqueryHelper.filter('[data-name=RightUpperMotorTotal]');
    this.LeftUpperMotorTotal = jqueryHelper.filter('[data-name=LeftUpperMotorTotal]');
    this.UpperMotorTotal = jqueryHelper.filter('[data-name=UpperMotorTotal]');
    this.RightLowerMotorTotal = jqueryHelper.filter('[data-name=RightLowerMotorTotal]');
    this.LeftLowerMotorTotal = jqueryHelper.filter('[data-name=LeftLowerMotorTotal]');
    this.LowerMotorTotal = jqueryHelper.filter('[data-name=LowerMotorTotal]');
    this.RightTouchTotal = jqueryHelper.filter('[data-name=RightTouchTotal]');
    this.LeftTouchTotal = jqueryHelper.filter('[data-name=LeftTouchTotal]');
    this.TouchTotal = jqueryHelper.filter('[data-name=TouchTotal]');
    this.RightPrickTotal = jqueryHelper.filter('[data-name=RightPrickTotal]');
    this.LeftPrickTotal = jqueryHelper.filter('[data-name=LeftPrickTotal]');
    this.PrickTotal = jqueryHelper.filter('[data-name=PrickTotal]');
    this.RightMotorTotal = jqueryHelper.filter('[data-name=RightMotorTotal]');
    this.LeftMotorTotal = jqueryHelper.filter('[data-name=LeftMotorTotal]');

    var that = this;
    this.ShowAll.bind('click', function (e) {
        that.AllTotals.addClass('visible');
        that.ShowAll.removeClass('visible');

        return true;
    });

    view.find('[data-type=Total]').bind('click', function (e) { return that.Total_Click(e); });
    $('body').bind('keydown', function (e) { return that.Document_KeyDown(e); })
        .bind('mousedown', function (e) { return that.Document_KeyDown(e); });

    return this;
};

sci.ui.IsncsciTotalsController.prototype.UpdateUsingJson = function (data) {
    this.RightUpperMotorTotal.text(data['RightUpperMotorTotal']);
    this.LeftUpperMotorTotal.text(data['LeftUpperMotorTotal']);
    this.UpperMotorTotal.text(data['UpperMotorTotal']);
    this.RightLowerMotorTotal.text(data['RightLowerMotorTotal']);
    this.LeftLowerMotorTotal.text(data['LeftLowerMotorTotal']);
    this.LowerMotorTotal.text(data['LowerMotorTotal']);
    this.RightTouchTotal.text(data['RightTouchTotal']);
    this.LeftTouchTotal.text(data['LeftTouchTotal']);
    this.TouchTotal.text(data['TouchTotal']);
    this.RightPrickTotal.text(data['RightPrickTotal']);
    this.LeftPrickTotal.text(data['LeftPrickTotal']);
    this.PrickTotal.text(data['PrickTotal']);
    this.RightMotorTotal.text(data['RightMotorTotal']);
    this.LeftMotorTotal.text(data['LeftMotorTotal']);
    this.UpdateTotalWithValue(this.TestTotals.find('[data-name=RightSensory]'), data['RightSensory']);
    this.UpdateTotalWithValue(this.TestTotals.find('[data-name=LeftSensory]'), data['LeftSensory']);
    this.UpdateTotalWithValue(this.TestTotals.find('[data-name=RightMotor]'), data['RightMotor']);
    this.UpdateTotalWithValue(this.TestTotals.find('[data-name=LeftMotor]'), data['LeftMotor']);
    this.UpdateTotalWithValue(this.TestTotals.find('[data-name=NeurologicalLevelOfInjury]'), data['NeurologicalLevelOfInjury']);
    this.UpdateTotalWithValue(this.TestTotals.find('[data-name=RightSensoryZpp]'), data['RightSensoryZpp']);
    this.UpdateTotalWithValue(this.TestTotals.find('[data-name=LeftSensoryZpp]'), data['LeftSensoryZpp']);
    this.UpdateTotalWithValue(this.TestTotals.find('[data-name=RightMotorZpp]'), data['RightMotorZpp']);
    this.UpdateTotalWithValue(this.TestTotals.find('[data-name=LeftMotorZpp]'), data['LeftMotorZpp']);
    this.UpdateTotalWithValue(this.TestTotals.find('[data-name=Completeness]'), data['Completeness']);
    this.UpdateTotalWithValue(this.TestTotals.find('[data-name=AsiaImpairmentScale]'), data['AsiaImpairmentScale']);
};

sci.ui.IsncsciTotalsController.prototype.ShowTotalRange = function (total) {
    this.RangeDialogContent.text(total.attr('data-value'));
    var offset = total.offset();
    var top = Math.round(offset.top - this.RangeDialog.height());
    this.RangeDialog
        .css('left', Math.round(offset.left + total.width() - this.RangeDialog.width() / 2) + 'px')
        .css('top', (top + 5) + 'px')
        .css('opacity', 0)
        .css('display', 'block')
        .animate({top: top + 'px', opacity: 1}, 300);
};

sci.ui.IsncsciTotalsController.prototype.UpdateTotalWithValue = function (total, value) {
    if (this.RangeRegex.test(value)) {
        total.attr('data-value', value);
        total.html('<span>ND</span>');
    } else {
        total.attr('data-value', '');
        total.text(value);
    }
};

sci.ui.IsncsciTotalsController.prototype.AppendTotals = function(totals) {
    var container = $('<li></li>').appendTo(this.AllTotals);
    var view = this.TotalsTemplate.clone().appendTo(container);

    view.find('[data-name=RightSensory]').text(formatLevelName(totals['RightSensory'].Name));
    view.find('[data-name=LeftSensory]').text(formatLevelName(totals['LeftSensory'].Name));
    view.find('[data-name=RightMotor]').text(formatLevelName(totals['RightMotor'].Name));
    view.find('[data-name=LeftMotor]').text(formatLevelName(totals['LeftMotor'].Name));
    view.find('[data-name=NeurologicalLevelOfInjury]').text(formatLevelName(totals['NeurologicalLevelOfInjury'].Name));
    view.find('[data-name=Completeness]').text(totals['Completeness']);
    view.find('[data-name=AsiaImpairmentScale]').text(totals['AsiaImpairmentScale']);

    if (totals['AsiaImpairmentScale'].toLowerCase() == 'a') {
        view.find('[data-name=RightSensoryZpp]').text(formatLevelName(totals['RightSensoryZpp'].Name));
        view.find('[data-name=LeftSensoryZpp]').text(formatLevelName(totals['LeftSensoryZpp'].Name));
        view.find('[data-name=RightMotorZpp]').text(formatLevelName(totals['RightMotorZpp'].Name));
        view.find('[data-name=LeftMotorZpp]').text(formatLevelName(totals['LeftMotorZpp'].Name));
    } else {
        view.find('[data-name=RightSensoryZpp]').text('NA');
        view.find('[data-name=LeftSensoryZpp]').text('NA');
        view.find('[data-name=RightMotorZpp]').text('NA');
        view.find('[data-name=LeftMotorZpp]').text('NA');
    }

    function formatLevelName(name) {
        return name.toLowerCase() == 's4-5' ? 'INT'
            : this.RangeRegex.test(name) ? 'ND' : name;
    }
};

sci.ui.IsncsciTotalsController.prototype.ClearTotals = function () {
    this.AllTotals.html('').removeClass('visible');
    this.ShowAll.removeClass('visible');
    this.TestTotals.find('[data-controller=IsncsciTotals]').html('&nbsp;');
    
    this.RightUpperMotorTotal.html('&nbsp;');
    this.LeftUpperMotorTotal.html('&nbsp;');
    this.UpperMotorTotal.html('&nbsp;');
    this.RightLowerMotorTotal.html('&nbsp;');
    this.LeftLowerMotorTotal.html('&nbsp;');
    this.LowerMotorTotal.html('&nbsp;');
    this.RightTouchTotal.html('&nbsp;');
    this.LeftTouchTotal.html('&nbsp;');
    this.TouchTotal.html('&nbsp;');
    this.RightPrickTotal.html('&nbsp;');
    this.LeftPrickTotal.html('&nbsp;');
    this.PrickTotal.html('&nbsp;');
    this.RightMotorTotal.html('&nbsp;');
    this.LeftMotorTotal.html('&nbsp;');

};

sci.ui.IsncsciTotalsController.prototype.ExportToJson = function () {
    var data = {
        RightUpperMotorTotal: this.RightUpperMotorTotal.first().text(),
        LeftUpperMotorTotal: this.LeftUpperMotorTotal.first().text(),
        UpperMotorTotal: this.UpperMotorTotal.first().text(),
        RightLowerMotorTotal: this.RightLowerMotorTotal.first().text(),
        LeftLowerMotorTotal: this.LeftLowerMotorTotal.first().text(),
        LowerMotorTotal: this.LowerMotorTotal.first().text(),
        RightTouchTotal: this.RightTouchTotal.first().text(),
        LeftTouchTotal: this.LeftTouchTotal.first().text(),
        TouchTotal: this.TouchTotal.first().text(),
        RightPrickTotal: this.RightPrickTotal.first().text(),
        LeftPrickTotal: this.LeftPrickTotal.first().text(),
        PrickTotal: this.PrickTotal.first().text(),
        RightMotorTotal: this.RightMotorTotal.first().text(),
        LeftMotorTotal: this.LeftMotorTotal.first().text()
    };
    
    var totals = this.TestTotals.find('[data-controller=IsncsciTotals]');
    
    for (var i = 0; i < totals.length; i++) {
        var total = $(totals[i]);
        data[total.attr('data-name')] = total.text();
    }

    return data;
};

sci.ui.IsncsciTotalsController.prototype.Total_Click = function (e) {
    var target = $(e.currentTarget);
    
    if (target.attr('data-value').length > 0)
        this.ShowTotalRange(target);
    
    return true;
};

sci.ui.IsncsciTotalsController.prototype.Document_KeyDown = function (e) {
    this.RangeDialog.css('display', 'none');
};

sci.Ready('sci.ui.IsncsciTotalsController');