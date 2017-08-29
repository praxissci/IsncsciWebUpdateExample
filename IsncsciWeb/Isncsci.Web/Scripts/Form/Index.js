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
var _loaded = false;
var _ready = true;

$(function () {
    _loaded = true;
    if (_ready) { Run(); }
});

function SciReady(e) {
    _ready = true;
    if (_loaded) { Run(); }
}

function Run() {
    var controller = new sci.neurology.NeurologyTestController();
    controller.Initialize($('body'));

    var pageActions = $('.page-actions');

    $(window).bind('scroll', function (e) {
        if ($(window).scrollTop() >= 45) {
            if (!pageActions.hasClass('fixed')) {
                pageActions.addClass('fixed');
            }
        } else if (pageActions.hasClass('fixed')) {
            pageActions.removeClass('fixed');
        }

        return true;
    });

    setTimeout(function () { $.post('Home/FormData/', {}, _onFormData); }, 500);

    function _onFormData(data) {
        console.log(data);
        var form = controller.IsncsciForm;

        updateLevel(form, 1, null, data.C2LeftPrick, data.C2LeftTouch, null, data.C2RightPrick, data.C2RightTouch);
        updateLevel(form, 2, null, data.C3LeftPrick, data.C3LeftTouch, null, data.C3RightPrick, data.C3RightTouch);
        updateLevel(form, 3, null, data.C4LeftPrick, data.C4LeftTouch, null, data.C4RightPrick, data.C4RightTouch);
        updateLevel(form, 4, data.C5LeftMotor, data.C5LeftPrick, data.C5LeftTouch, data.C5RightMotor, data.C5RightPrick, data.C5RightTouch);
        updateLevel(form, 5, data.C6LeftMotor, data.C6LeftPrick, data.C6LeftTouch, data.C6RightMotor, data.C6RightPrick, data.C6RightTouch);
        updateLevel(form, 6, data.C7LeftMotor, data.C7LeftPrick, data.C7LeftTouch, data.C7RightMotor, data.C7RightPrick, data.C7RightTouch);
        updateLevel(form, 7, data.C8LeftMotor, data.C8LeftPrick, data.C8LeftTouch, data.C8RightMotor, data.C8RightPrick, data.C8RightTouch);
        updateLevel(form, 8, data.T1LeftMotor, data.T1LeftPrick, data.T1LeftTouch, data.T1RightMotor, data.T1RightPrick, data.T1RightTouch);
        updateLevel(form, 9, null, data.T2LeftPrick, data.T2LeftTouch, null, data.T2RightPrick, data.T2RightTouch);
        updateLevel(form, 10, null, data.T3LeftPrick, data.T3LeftTouch, null, data.T3RightPrick, data.T3RightTouch);
        updateLevel(form, 11, null, data.T4LeftPrick, data.T4LeftTouch, null, data.T4RightPrick, data.T4RightTouch);
        updateLevel(form, 12, null, data.T5LeftPrick, data.T5LeftTouch, null, data.T5RightPrick, data.T5RightTouch);
        updateLevel(form, 13, null, data.T6LeftPrick, data.T6LeftTouch, null, data.T6RightPrick, data.T6RightTouch);
        updateLevel(form, 14, null, data.T7LeftPrick, data.T7LeftTouch, null, data.T7RightPrick, data.T7RightTouch);
        updateLevel(form, 15, null, data.T8LeftPrick, data.T8LeftTouch, null, data.T8RightPrick, data.T8RightTouch);
        updateLevel(form, 16, null, data.T9LeftPrick, data.T9LeftTouch, null, data.T9RightPrick, data.T9RightTouch);
        updateLevel(form, 17, null, data.T10LeftPrick, data.T10LeftTouch, null, data.T10RightPrick, data.T10RightTouch);
        updateLevel(form, 18, null, data.T11LeftPrick, data.T11LeftTouch, null, data.T11RightPrick, data.T11RightTouch);
        updateLevel(form, 19, null, data.T12LeftPrick, data.T12LeftTouch, null, data.T12RightPrick, data.T12RightTouch);
        updateLevel(form, 20, null, data.L1LeftPrick, data.L1LeftTouch, null, data.L1RightPrick, data.L1RightTouch);
        updateLevel(form, 21, data.L2LeftMotor, data.L2LeftPrick, data.L2LeftTouch, data.L2RightMotor, data.L2RightPrick, data.L2RightTouch);
        updateLevel(form, 22, data.L3LeftMotor, data.L3LeftPrick, data.L3LeftTouch, data.L3RightMotor, data.L3RightPrick, data.L3RightTouch);
        updateLevel(form, 23, data.L4LeftMotor, data.L4LeftPrick, data.L4LeftTouch, data.L4RightMotor, data.L4RightPrick, data.L4RightTouch);
        updateLevel(form, 24, data.L5LeftMotor, data.L5LeftPrick, data.L5LeftTouch, data.L5RightMotor, data.L5RightPrick, data.L5RightTouch);
        updateLevel(form, 25, data.S1LeftMotor, data.S1LeftPrick, data.S1LeftTouch, data.S1RightMotor, data.S1RightPrick, data.S1RightTouch);
        updateLevel(form, 26, null, data.S2LeftPrick, data.S2LeftTouch, null, data.S2RightPrick, data.S2RightTouch);
        updateLevel(form, 27, null, data.S3LeftPrick, data.S3LeftTouch, null, data.S3RightPrick, data.S3RightTouch);
        updateLevel(form, 28, null, data.S4_5LeftPrick, data.S4_5LeftTouch, null, data.S4_5RightPrick, data.S4_5RightTouch);
    }

    function updateLevel(form, levelOrdinal, leftMotor, leftPrick, leftTouch, rightMotor, rightPrick, rightTouch) {
        var level = form.GetLevelAt(levelOrdinal);

        if (leftMotor)
            level.LeftMotor.UpdateValues(leftMotor, false, false, null, '', '');

        level.LeftPrick.UpdateValues(leftPrick, false, false, null, '', '');
        level.LeftTouch.UpdateValues(leftTouch, false, false, null, '', '');

        if (rightMotor)
            level.RightMotor.UpdateValues(rightMotor, false, false, null, '', '');

        level.RightPrick.UpdateValues(rightPrick, false, false, null, '', '');
        level.RightTouch.UpdateValues(rightTouch, false, false, null, '', '');
    }
}

function updateFormFrom(json) {
    console.log(json);
}