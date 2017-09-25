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
sci.Require('sci.neurology.IsncsciForm');
sci.Require('sci.ui.IsncsciGridController');
sci.Require('sci.ui.IsncsciTotalsController');
sci.Require('sci.ui.DermatomeDiagramController');
sci.Provide('sci.neurology.NeurologyTestController');

sci.neurology.NeurologyTestController = function () {
    this.View = null;
    this.RightGrid = null;
    this.LeftGrid = null;
    this.TotalsController = null;
    this.DermatomeDiagramController = null;
    this.IsncsciForm = null;
    this.CurrentDermatome = null;
    this.CellInputHasFocus = false;
    this.NameBar = null;
    this.ValueButtons = null;
    this.ImpairmentNotDueToSciComponents = null;
    this.DisablePropagationBox = null;
    this.MoveNextAfterInput = true;
    this.CellInputHasFocus = false;
    this.BusyIndicator = null;
    this.NtRegex = /^nt$/i;

    this.MotorImpairmentNotDueToSci = {
        Options: [
            { Value: 1, Label: 'Plexopathy' },
            { Value: 2, Label: 'Peripheral neuropathy' },
            { Value: 3, Label: 'Pre-existing myoneural disease (e.g. Stroke, MS, etc.)' },
            { Value: 6, Label: 'Other (specify:)' }
        ],
        Text: 'If motor impairment not due to SCI, please indicate reason:'
    };

    this.SensoryImpairmentNotDueToSci = {
        Options: [
            { Value: 1, Label: 'Plexopathy' },
            { Value: 2, Label: 'Peripheral neuropathy' },
            { Value: 3, Label: 'Pre-existing myoneural disease (e.g. Stroke, MS, etc.)' },
            { Value: 6, Label: 'Other (specify:)' }
        ],
        Text: 'If sensory impairment not due to SCI, please indicate reason:'
    };

    this.ImpairmentNotDueToSci = {
        Options: [
            { Value: 4, Label: 'Pain' },
            { Value: 5, Label: 'Disuse atrophy' },
            { Value: 6, Label: 'Other (specify:)' }
        ],
        Text: 'If motor impairment due to inhibiting factors, please indicate reason:'
    };
};

/// <summary>
/// Must be called after the entire page has loaded.
/// Links the UI elements to their respective variables and does the initial components setup.
/// Displays the ASIA Man taking into consideration SVG from the browser support.
/// </summary>
/// <param name="view">JQuery selector of the Neurology Form View. Used to contain our JQuery selections within a segment of the page.</param>
sci.neurology.NeurologyTestController.prototype.Initialize = function (view) {
    if (!view)
        throw 'sci.neurology.NeurologyTestController :: A JQuery based view is required';

    this.View = view;

    var jqueryHelper = this.View.find('[data-controller=NeurologyTest]');
    this.NameBar = jqueryHelper.filter('[data-name=NameBar]');
    this.ValueButtons = jqueryHelper.filter('[data-name=ValueButton]');
    this.DisablePropagationBox = jqueryHelper.filter('[data-name=DisablePropagationBox]');
    this.BusyIndicator = jqueryHelper.filter('[data-name=BusyIndicator]');

    // EE: Controls for entering the reason for impairment not due to SCI
    this.ImpairmentNotDueToSciComponents = {
        Reason: {
            Container: jqueryHelper.filter('[data-name=ReasonNotSciContainer]'),
            Label: jqueryHelper.filter('[data-name=ReasonNotSciLabel]'),
            Input: jqueryHelper.filter('[data-name=ReasonNotSci]')
        },
        Comments: {
            Container: jqueryHelper.filter('[data-name=ReasonNotSciCommentContainer]'),
            Label: jqueryHelper.filter('[data-name=ReasonNotSciCommentLabel]'),
            Input: jqueryHelper.filter('[data-name=ReasonNotSciComment]')
        }
    };

    this.IsncsciForm = new sci.neurology.IsncsciForm();
    this.RightGrid = (new sci.ui.IsncsciGridController()).Initialize(this.View.find('.right-column tbody'), this.IsncsciForm, true);
    this.LeftGrid = (new sci.ui.IsncsciGridController()).Initialize(this.View.find('.left-column tbody'), this.IsncsciForm, false);
    this.TotalsController = (new sci.ui.IsncsciTotalsController()).Initialize(this.View);
    this.DermatomeDiagramController = (new sci.ui.DermatomeDiagramController()).Initialize(jqueryHelper.filter('[data-name=DermatomeDiagram]'), this.IsncsciForm);

    var that = this;
    $('body').bind('click', function (e) { return that.Document_Click(e); });
    $('body').bind('keydown', function (e) { return that.Document_KeyDown(e); });
    this.RightGrid.AddObserver('CellClicked', this, 'Grid_CellClicked');
    this.LeftGrid.AddObserver('CellClicked', this, 'Grid_CellClicked');
    this.RightLowestNonKeyMuscleWithMotorFunction = jqueryHelper.filter('[data-name=RightLowestNonKeyMuscleWithMotorFunction]')
        .bind('change', function (e) { return that.ObservationDropdown_Change(e); })
        .val('');
    this.LeftLowestNonKeyMuscleWithMotorFunction = jqueryHelper.filter('[data-name=LeftLowestNonKeyMuscleWithMotorFunction]')
        .bind('change', function (e) { return that.ObservationDropdown_Change(e); })
        .val('');
    this.Comments = jqueryHelper.filter('[data-name=Comments]')
        .bind('change', function (e) { return that.Comments_Change(e); })
        .val('');
    this.AnalSensation = jqueryHelper.filter('[data-name=AnalSensation]')
        .bind('change', function (e) { return that.ObservationDropdown_Change(e); })
        .val('');
    this.AnalContraction = jqueryHelper.filter('[data-name=AnalContraction]')
        .bind('change', function (e) { return that.ObservationDropdown_Change(e); })
        .val('');
    jqueryHelper.filter('[data-name=CalculateButton]').bind('click', function (e) { return that.Calculate_Click(e); });
    jqueryHelper.filter('[data-name=ClearFormButton]').bind('click', function (e) { that.ClearForm(); return false; });
    jqueryHelper.filter('[data-name=SaveButton]').bind('click', function (e) { return that.Save_Click(e); });

    this.ImpairmentNotDueToSciComponents.Reason.Input.bind('focus', function (e) { that.CellInputHasFocus = true; return true; })
        .bind('blur', function (e) { that.CellInputHasFocus = false; return true; })
        .bind('change', function (e) { return that.ImpairmentReason_Change(e); });

    this.ImpairmentNotDueToSciComponents.Comments.Input.bind('focus', function (e) { that.CellInputHasFocus = true; return true; })
        .bind('blur', function (e) { that.CellInputHasFocus = false; return true; })
        .bind('change', function (e) { return that.ImpairmentReason_Change(e); });

    return this;
};

sci.neurology.NeurologyTestController.prototype.SetCurrentDermatome = function (dermatome) {
    // Clear the current selections
    this.RightGrid.SelectCellWith(null);
    this.LeftGrid.SelectCellWith(null);

    this.CurrentDermatome = dermatome;
    this.UpdateInputComponents(this.CurrentDermatome);
    this.UpdateImpairmentNotDueToSciComponents(this.CurrentDermatome);

    if (this.CurrentDermatome) {
        if (this.CurrentDermatome.Side === 'Right') {
            this.RightGrid.SelectCellWith(this.CurrentDermatome);
        } else {
            this.LeftGrid.SelectCellWith(this.CurrentDermatome);
        }
    }
};

sci.neurology.NeurologyTestController.prototype.MoveSelection = function (direction) {
    if (!this.CurrentDermatome)
        return;

    var dermatome = null;

    switch (direction) {
        case 'Previous':
            dermatome = this.CurrentDermatome.Side === 'Right' ? this.RightGrid.GetSelectionsPreviousDermatome() : this.LeftGrid.GetSelectionsPreviousDermatome();
            break;
        case 'Next':
            dermatome = this.CurrentDermatome.Side === 'Right' ? this.RightGrid.GetSelectionsNextDermatome() : this.LeftGrid.GetSelectionsNextDermatome();
            break;
        case 'Up':
            dermatome = this.CurrentDermatome.Side === 'Right' ? this.RightGrid.GetDermatomeOnSelectionsTop() : this.LeftGrid.GetDermatomeOnSelectionsTop();
            break;
        case 'Right':
            dermatome = this.CurrentDermatome.Side === 'Right' ? this.RightGrid.GetDermatomeOnSelectionsRight() : this.LeftGrid.GetDermatomeOnSelectionsRight();
            break;
        case 'Down':
            dermatome = this.CurrentDermatome.Side === 'Right' ? this.RightGrid.GetDermatomeOnSelectionsBottom() : this.LeftGrid.GetDermatomeOnSelectionsBottom();
            break;
        case 'Left':
            dermatome = this.CurrentDermatome.Side === 'Right' ? this.RightGrid.GetDermatomeOnSelectionsLeft() : this.LeftGrid.GetDermatomeOnSelectionsLeft();
            break;
    }

    if (dermatome)
        this.SetCurrentDermatome(dermatome);
};

sci.neurology.NeurologyTestController.prototype.UpdateInputComponents = function (dermatome) {
    this.NameBar.text(dermatome ? dermatome.Level.Name + ' ' + dermatome.Side + ' ' + dermatome.MeasurementType : '');

    if (!dermatome) {
        this.ValueButtons.addClass('disabled');
        return;
    }

    this.ValueButtons.removeClass('disabled');

    if (dermatome.MeasurementType !== 'Motor')
        this.ValueButtons.filter(':not(.sensory)').addClass('disabled');
};

sci.neurology.NeurologyTestController.prototype.UpdateImpairmentNotDueToSciComponents = function (dermatome) {
    if (!dermatome || !dermatome.HasImpairmentNotDueToSci) {
        this.ImpairmentNotDueToSciComponents.Reason.Container.addClass('not-applicable');
        this.ImpairmentNotDueToSciComponents.Comments.Container.addClass('not-applicable');
        return;
    }

    this.ImpairmentNotDueToSciComponents.Reason.Container.removeClass('not-applicable');
    this.ImpairmentNotDueToSciComponents.Comments.Container.removeClass('not-applicable');

    var impairmentType = dermatome.MeasurementType === 'Motor'
        ? dermatome.Value == '5*'
            ? this.ImpairmentNotDueToSci
            : this.MotorImpairmentNotDueToSci
        : this.SensoryImpairmentNotDueToSci;

    var options = '<option></option>';
    var optionsLength = impairmentType.Options.length;

    for (var i = 0; i < optionsLength; i++) {
        var option = impairmentType.Options[i];
        options += dermatome.Reason === option.Value
            ? '<option value="' + option.Value + '" selected="selected" class="cell-input">' + option.Label + '</option>'
            : '<option value="' + option.Value + '" class="cell-input">' + option.Label + '</option>';
    }

    this.ImpairmentNotDueToSciComponents.Reason.Label.text(impairmentType.Text);
    this.ImpairmentNotDueToSciComponents.Reason.Input.html(options);
    this.ImpairmentNotDueToSciComponents.Comments.Input.val(dermatome.Comments);
    this.ImpairmentNotDueToSciComponents.Reason.Container.removeClass('not-applicable');
    this.ImpairmentNotDueToSciComponents.Comments.Container.removeClass('not-applicable');
};

sci.neurology.NeurologyTestController.prototype.GetValueFromKeyCode = function (code, currentValue, isMotor) {
    var value = null;

    switch (code) {
        case 96:
        case 48:
            value = 0;
            break;
        case 97:
        case 49:
            value = 1;
            break;
        case 98:
        case 50:
            value = 2;
            break;
        case 78:
            value = 'NT';
            break;
        case 106:
        case 56:
            // This portion handles adding a flag to a value.
            // It will get the current value on the cell and, if valid, it will append the * flag to it.
            var cv1 = parseInt(currentValue);
            value = (!isNaN(cv1) && cv1 === 5) || this.NtRegex.test(currentValue) ? currentValue + '*' : null;
            break;
        case 33:
            // This portion handles adding a flag to a value.
            // It will get the current value on the cell and, if valid, it will append the ! flag to it.
            var cv2 = parseInt(currentValue);
            var maxLimit = isMotor ? 4 : 1;
            value = (!isNaN(cv2) && cv2 >= 0 && cv2 <= maxLimit) || this.NtRegex.test(currentValue) ? currentValue + '!' : null;
            break;
    }

    if (!isMotor || value)
        return value;

    switch (code) {
        case 99:
        case 51:
            value = 3;
            break;
        case 100:
        case 52:
            value = 4;
            break;
        case 101:
        case 53:
            value = 5;
            break;
    }

    return value;
};

sci.neurology.NeurologyTestController.prototype.HandleCellKey = function (keyCode, shiftKey) {
    switch (keyCode) {
        case 9:
            if (shiftKey) {
                this.MoveSelection('Previous');
            }
            else {
                this.MoveSelection('Next');
            }
            break;
        case 37:
            this.MoveSelection('Left');
            break;
        case 38:
            this.MoveSelection('Up');
            break;
        case 39:
            this.MoveSelection('Right');
            break;
        case 40:
            this.MoveSelection('Down');
            break;
        case 27:
            this.SetCurrentDermatome(null);
            break;
        default:
            // Check for the very special case where the user is attmepting to enter a flag described by the exclamation point.
            // This case is special because on the English keyboard, the exclamation flag shares key with the number 1, which is a valid input value already
            // The code for exclamation point is 33
            var keyCodeAfterCheck = keyCode === 49 && shiftKey ? 33 : keyCode;

            // The default handler attempts to set the value expressed by the key pressed into the selected cell
            // GetValueFromKeyCode will return the appropriate value based on the key code and if the cell is a motor cell
            // Null gets returned if the key represents no valid value
            var v = this.GetValueFromKeyCode(keyCodeAfterCheck, this.CurrentDermatome.Value, this.CurrentDermatome.MeasurementType === 'Motor');

            // Had to add this if so that I exclude null values but can still select 0
            // If we get a value we need to set it in the cell and propagate it down
            if (v || v === 0) {
                //this.SelectedCell.SetValue(v, keyCodeAfterCheck == 56 || keyCodeAfterCheck == 106 || keyCodeAfterCheck == 33);
                this.CurrentDermatome.UpdateValues(v, true, keyCodeAfterCheck === 56 || keyCodeAfterCheck == 106 || keyCodeAfterCheck === 33, null, '', '');
                //this.UpdateAsiaManOn(this.SelectedCell);

                if (!this.DisablePropagationBox.prop('checked'))
                    this.IsncsciForm.PropagateValueFrom(this.CurrentDermatome.Level.Ordinal, this.CurrentDermatome.Side + this.CurrentDermatome.MeasurementType);

                this.UpdateImpairmentNotDueToSciComponents(this.CurrentDermatome);

                if (this.MoveNextAfterInput && !this.CurrentDermatome.HasImpairmentNotDueToSci)
                    this.MoveSelection('Down');
            }
            break;
    }
};

sci.neurology.NeurologyTestController.prototype.ClearForm = function () {
    this.SetCurrentDermatome(null);
    this.IsncsciForm.ClearForm();
    this.TotalsController.ClearTotals();
    this.RightLowestNonKeyMuscleWithMotorFunction.val('').trigger('change');
    this.LeftLowestNonKeyMuscleWithMotorFunction.val('').trigger('change');
    this.Comments.val('').trigger('change');
    this.AnalContraction.val('').trigger('change');
    this.AnalSensation.val('').trigger('change');
};

/// <summary>
/// Handles any mouse click anywhere on the document.
/// If the click happens on a cell, the controller will enable the adequate input controls.
/// If the click happens on an input control, the controller will set and propagate the selected value.
/// If the click happens on an input component that requires focus, like a comment box, the controller will ignore the event.
/// If the click happens anywhere else, the controller hide the input controls.
/// </summary>
/// <param name="e">Event arguments.</param>
sci.neurology.NeurologyTestController.prototype.Document_Click = function (e) {
    var t = $(e.target);

    if (t.parent().hasClass('combo-item')) {
        if (!t.hasClass('disabled')) {
            this.CurrentDermatome.UpdateValues(t.attr('data-value'), true, t.hasClass('flag'), null, '', '');

            if (!this.DisablePropagationBox.prop('checked'))
                this.IsncsciForm.PropagateValueFrom(this.CurrentDermatome.Level.Ordinal, this.CurrentDermatome.Side + this.CurrentDermatome.MeasurementType);

            this.UpdateImpairmentNotDueToSciComponents(this.CurrentDermatome);

            if (this.MoveNextAfterInput && !this.CurrentDermatome.HasImpairmentNotDueToSci)
                this.MoveSelection('Down');
        }
    } else if (t.hasClass('cell-input') || t.hasClass('extra-input')) {
        //do nothing
        // This catches the events coming from the components to cature impairment not due to SCI which
        // were clearing the form's selection after being catched by the final else
    } else {
        this.SetCurrentDermatome(null);
    }

    return true;
};

sci.neurology.NeurologyTestController.prototype.Document_KeyDown = function (e) {
    // No need to handle the event if no cell is selected or if a native HTML input control has focus
    if (!this.CurrentDermatome || this.CellInputHasFocus)
        return true;

    this.HandleCellKey(e.which, e.shiftKey);

    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();

    return false;
};

sci.neurology.NeurologyTestController.prototype.Grid_CellClicked = function (e) {
    if (this.CellInputHasFocus)
        this.ImpairmentNotDueToSciComponents.Comments.Input.trigger('blur');

    this.SetCurrentDermatome(e.Dermatome);
};

sci.neurology.NeurologyTestController.prototype.ImpairmentReason_Change = function (e) {
    if (!this.CurrentDermatome || !this.CurrentDermatome.HasImpairmentNotDueToSci)
        return true;

    this.CurrentDermatome.UpdateValues(this.CurrentDermatome.Value,
        true,
        this.CurrentDermatome.HasImpairmentNotDueToSci,
        this.ImpairmentNotDueToSciComponents.Reason.Input.val(),
        this.ImpairmentNotDueToSciComponents.Reason.Input.find('option:selected').text(),
        this.ImpairmentNotDueToSciComponents.Comments.Input.val());

    if (!this.DisablePropagationBox.prop('checked'))
        this.IsncsciForm.PropagateValueFrom(this.CurrentDermatome.Level.Ordinal, this.CurrentDermatome.Side + this.CurrentDermatome.MeasurementType);

    return true;
};

sci.neurology.NeurologyTestController.prototype.ObservationDropdown_Change = function (e) {
    var t = $(e.currentTarget);
    this.IsncsciForm[t.attr('data-name')] = t.val();
    return true;
};

sci.neurology.NeurologyTestController.prototype.Comments_Change = function (e) {
    this.IsncsciForm.Comments = $(e.currentTarget).val();
};

sci.neurology.NeurologyTestController.prototype.Calculate_Click = function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();

    var that = this;
    var formData = this.IsncsciForm.ExportToJson();

    if (!formData.IsComplete) {
        alert('Could not calculate, the form is incomplete.');
        return false;
    }

    if (this.AnalSensation.val() === 'None') {
        alert('Could not calculate, please specify a value for "deep anal pressure".');
        return false;
    }

    if (this.AnalContraction.val() === 'None') {
        alert('Could not calculate, please specify a value for "voluntary anal contraction".');
        return false;
    }

    this.BusyIndicator.css('display', 'block');

    jQuery.ajax({
        type: "POST",
        url: '/api/algorithm/',
        data: formData.Form,
        dataType: "json",
        cache: false,
        //    crossDomain: true,
        processData: true,
        success: function (data) {
            that.BusyIndicator.css('display', 'none');
            that.TotalsController.UpdateUsingJson(data);
        },
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            that.BusyIndicator.css('display', 'none');
            alert(textStatus + ':\n' + errorThrown);
        }
    });

    return false;
};
sci.neurology.NeurologyTestController.prototype.Save_Click = function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();

    var that = this;
    var formData = this.IsncsciForm.ExportToJson();
    
    var x = formData.Form;

    //var varurl = '@Url.Action("Save", "PatientTest")';
    var varurl = '/PatientTest/Save/';
    var view = e.view.location.toString();
    var patientTestId = view.substring(view.indexOf("=") + 1);

    var jqXHR = $.ajax({
        method: 'post',
        traditional: true,
        url: varurl,

        data: Object.assign({
            'PatientTestId': patientTestId,
            'TestType': x.TestType,
            'Examiner1': x.Examiner1,
            'Examiner2': x.Examiner2,
            'TestStatusId': x.TestStatusId,
            //MSUERTotal
            //MSUELTotal
            //MSUEMSTotal
            //MSLERTotal
            //MSLELTotal
            //MSLEMSTotal
            //SSLTRTotal
            //SSLTLTotal
            //SSLTTotal
            //SSPPRTotal
            //SSPPLTotal
            //SSPPTotal
            //NLSENSR
            //NLSENSL
            //NLMOTOTR
            //NLMOTORL
            //NLInjury
            //ComplIncompl
            //AIS
            //ZonePartPresSensR
            //ZonePartPresSensL
            //ZonePartPresMotoR
            //ZonePartPresMotoL
            //LastUpdateDate
            //LastUpdateBy
        }, formData.Form),
        cache: false,
        success: function (results) {
            alert("success")
        }
    }).done(function (result) {
            alert("done");
        })
        .error(function (xhr, status, error) {
            alert("error" + error);
        });

    return true;
};
sci.Ready('sci.neurology.NeurologyTestController');