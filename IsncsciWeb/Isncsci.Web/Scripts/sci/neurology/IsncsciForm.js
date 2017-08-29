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
sci.Require('sci.neurology.Dermatome');
sci.Require('sci.patterns.observer.Observable');
sci.Provide('sci.neurology.IsncsciForm');

sci.neurology.IsncsciForm = function () {
    sci.patterns.observer.Observable.call(this);
    
    this.LevelNames = ['C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12', 'L1', 'L2', 'L3', 'L4', 'L5', 'S1', 'S2', 'S3', 'S4_5'];
    this.KeyMuscles = 'C5,C6,C7,C8,T1,L2,L3,L4,L5,S1,';
    this.Levels = new Array();

    this.RightLowestNonKeyMuscleWithMotorFunction = 0;
    this.LeftLowestNonKeyMuscleWithMotorFunction = 0;
    this.AnalContraction = false;
    this.AnalSensation = false;
    this.Comments = '';
    
    this.InitializeLevels();
};

sci.neurology.IsncsciForm.prototype.InitializeLevels = function () {
    var previousLevel = null;

    for (var i = 0; i < this.LevelNames.length; i++) {
        var name = this.LevelNames[i];
        var isKeyMuscle = this.KeyMuscles.indexOf(name + ',') !== -1;
        var currentLevel = new sci.neurology.IsncsciFormLevel(name, i + 1, isKeyMuscle, i >= 20 && i <= 24);

        if (previousLevel) {
            previousLevel.Next = currentLevel;
            currentLevel.Previous = previousLevel;
        }

        if (isKeyMuscle) {
            currentLevel.RightMotor.AddObserver('Updated', this, 'Dermatome_Updated');
        }
        
        previousLevel = currentLevel;
        this.Levels.push(currentLevel);
    }

    return this;
};

sci.neurology.IsncsciForm.prototype.GetLevelAt = function (ordinal) {
    return this.Levels[ordinal - 1];
};

sci.neurology.IsncsciForm.prototype.GetDermatomeBy = function (levelName, side, measurementType) {
    var level = null;
    var index = 0;
    
    while (!level && index < this.Levels.length) {
        if (this.Levels[index].Name === levelName)
            level = this.Levels[index];
        
        index++;
    }
    
    return !level ? null : level[side + measurementType];
};

sci.neurology.IsncsciForm.prototype.PropagateRightMotorValueFrom = function (ordinal) {
    this.PropagateValueFrom(ordinal, 'RightMotor');
};

sci.neurology.IsncsciForm.prototype.PropagateLeftMotorValueFrom = function (ordinal) {
    this.PropagateValueFrom(ordinal, 'LeftMotor');
};

sci.neurology.IsncsciForm.prototype.PropagateRightTouchValueFrom = function (ordinal) {
    this.PropagateValueFrom(ordinal, 'RightTouch');
};

sci.neurology.IsncsciForm.prototype.PropagateLeftTouchValueFrom = function (ordinal) {
    this.PropagateValueFrom(ordinal, 'LeftTouch');
};

sci.neurology.IsncsciForm.prototype.PropagateRightPrickValueFrom = function (ordinal) {
    this.PropagateValueFrom(ordinal, 'RightPrick');
};

sci.neurology.IsncsciForm.prototype.PropagateLeftPrickValueFrom = function (ordinal) {
    this.PropagateValueFrom(ordinal, 'LeftPrick');
};

sci.neurology.IsncsciForm.prototype.PropagateValueFrom = function (ordinal, valueType) {
    if ('RightMotor,LeftMotor,RightTouch,LeftTouch,RightPrick,LeftPrick,'.indexOf(valueType + ',') === -1)
        return;
    
    var level = this.Levels[ordinal - 1];

    if (!level)
        return;

    var isMotor = valueType === 'RightMotor' || valueType === 'LeftMotor';
    var currentLevel = level.Next;
    var dermatome = level[valueType];

    while (currentLevel) {
        if (!isMotor || currentLevel.IsKeyMuscle) {
            var currentDermatome = currentLevel[valueType];
            currentDermatome.UpdateValues(dermatome.Value, false, dermatome.HasImpairmentNotDueToSci, dermatome.Reason, dermatome.ReasonText, dermatome.Comments);
        }
        
        currentLevel = currentLevel.Next;
    }
};

sci.neurology.IsncsciForm.prototype.ClearForm = function () {
    this.RightLowestNonKeyMuscleWithMotorFunction = 0;
    this.LeftLowestNonKeyMuscleWithMotorFunction = 0;
    this.AnalContraction = false;
    this.AnalSensation = false;
    this.Comments = '';
    
    for (var i = 0; i < this.Levels.length; i++) {
        var level = this.Levels[i];
        level.RightTouch.UpdateValues('', false, false, null, '', '');
        level.RightPrick.UpdateValues('', false, false, null, '', '');
        level.LeftTouch.UpdateValues('', false, false, null, '', '');
        level.LeftPrick.UpdateValues('', false, false, null, '', '');
        
        if (level.IsKeyMuscle) {
            level.RightMotor.UpdateValues('', false, false, null, '', '');
            level.LeftMotor.UpdateValues('', false, false, null, '', '');
        }
    }
};

sci.neurology.IsncsciForm.prototype.ExportToXml = function () {
    var result = '<Form>';

    for (var i = 0; i < this.Levels.length; i++) {
        var level = this.Levels[i];
        result += '<' + level.Name + 'RightTouch>' + level.RightTouch.Value + '</' + level.Name + 'RightTouch>';
        result += '<' + level.Name + 'LeftTouch>' + level.LeftTouch.Value + '</' + level.Name + 'LeftTouch>';
        result += '<' + level.Name + 'RightPrick>' + level.RightPrick.Value + '</' + level.Name + 'RightPrick>';
        result += '<' + level.Name + 'LeftPrick>' + level.LeftPrick.Value + '</' + level.Name + 'LeftPrick>';
        
        if (level.IsKeyMuscle) {
            result += '<' + level.Name + 'RightMotor>' + level.RightMotor.Value + '</' + level.Name + 'RightMotor>';
            result += '<' + level.Name + 'LeftMotor>' + level.LeftMotor.Value + '</' + level.Name + 'LeftMotor>';
        }
    }

    result += '<RightLowestNonKeyMuscleWithMotorFunction>' + this.RightLowestNonKeyMuscleWithMotorFunction + '</RightLowestNonKeyMuscleWithMotorFunction>\n';
    result += '<LeftLowestNonKeyMuscleWithMotorFunction>' + this.LeftLowestNonKeyMuscleWithMotorFunction + '</LeftLowestNonKeyMuscleWithMotorFunction>\n';
    result += '<AnalContraction>' + this.AnalContraction + '</AnalContraction>\n';
    result += '<AnalSensation>' + this.AnalSensation + '</AnalSensation>\n';
    result += '<Comments>' + this.Comments + '</Comments>\n';
    result += '</Form>';

    return result;
};

sci.neurology.IsncsciForm.prototype.ExportToJson = function () {
    var form = {};
    var result = {
        ContainsNt: false,
        IsComplete: true,
        Form: form
    };

    for (var i = 0; i < this.Levels.length; i++) {
        var motorHasNt = false;
        var motorIsMissingValues = false;
        var level = this.Levels[i];
        form[level.Name + 'RightTouch'] = level.RightTouch.Value;
        form[level.Name + 'LeftTouch'] = level.LeftTouch.Value;
        form[level.Name + 'RightPrick'] = level.RightPrick.Value;
        form[level.Name + 'LeftPrick'] = level.LeftPrick.Value;

        if (level.IsKeyMuscle) {
            form[level.Name + 'RightMotor'] = level.RightMotor.Value;
            form[level.Name + 'LeftMotor'] = level.LeftMotor.Value;
            motorHasNt = level.RightMotor.Value === 'NT' || level.LeftMotor.Value === 'NT';
            motorIsMissingValues = level.RightMotor.Value.toString() === '' || level.LeftMotor.Value.toString() === '';
        }

        if (level.RightTouch.Value === 'NT' || level.LeftTouch.Value === 'NT' || level.RightPrick.Value === 'NT' || level.LeftPrick.Value === 'NT' || motorHasNt) {
            result.ContainsNt = true;
        }

        if (level.RightTouch.Value.toString() === '' || level.LeftTouch.Value.toString() === ''
            || level.RightPrick.Value.toString() === '' || level.LeftPrick.Value.toString() === ''
            || motorIsMissingValues) {
            result.IsComplete = false;
        }
    }

    form.RightLowestNonKeyMuscleWithMotorFunction = this.RightLowestNonKeyMuscleWithMotorFunction;
    form.LeftLowestNonKeyMuscleWithMotorFunction = this.LeftLowestNonKeyMuscleWithMotorFunction;
    form.AnalContraction = this.AnalContraction;
    form.AnalSensation = this.AnalSensation;

    return result;
};

sci.neurology.IsncsciForm.prototype.GetNonSciImpairmentSummary = function () {
    //var nonSciImpairment = '';
    var rightTouchNonSciImpairment = '';
    var leftTouchNonSciImpairment = '';
    var rightPrickNonSciImpairment = '';
    var leftPrickNonSciImpairment = '';
    var rightMotorNonSciImpairment = '';
    var leftMotorNonSciImpairment = '';
    var rightTouchStart = null;
    var leftTouchStart = null;
    var rightPrickStart = null;
    var leftPrickStart = null;
    var rightMotorStart = null;
    var leftMotorStart = null;
    var lastRightMotor = null;
    var lastLeftMotor = null;
    
    for (var i = 0; i < this.Levels.length; i++) {
        var level = this.Levels[i];
        
        //- RIGHT TOUCH ------------------------------------
        if (level.RightTouch.HasImpairmentNotDueToSci) {
            if (level.RightTouch.EnteredByUser) {
                if (rightTouchStart) { // Consecutive cell with impairment not due to sci
                    rightTouchNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(rightTouchStart, this.Levels[i - 1].RightTouch);
                }

                if (level.Name === 'S4_5') {
                    rightTouchNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(level.RightTouch, level.RightTouch);
                }

                rightTouchStart = level.RightTouch;
            } else if (i === this.Levels.length - 1) { // Range all the way to the last cell on the column
                rightTouchNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(rightTouchStart, this.Levels[this.Levels.length - 1].RightTouch);
                rightTouchStart = null;
            }
        } else if (rightTouchStart) { // Cell breaking the range of cells with non-sci impairment
            rightTouchNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(rightTouchStart, this.Levels[i - 1].RightTouch);
            rightTouchStart = null;
        }
        
        //- LEFT TOUCH ------------------------------------
        if (level.LeftTouch.HasImpairmentNotDueToSci) {
            if (level.LeftTouch.EnteredByUser) {
                if (leftTouchStart) { // Consecutive cell with impairment not due to sci
                    leftTouchNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(leftTouchStart, this.Levels[i - 1].LeftTouch);
                }

                if (level.Name === 'S4_5') {
                    leftTouchNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(level.LeftTouch, level.LeftTouch);
                }

                leftTouchStart = level.LeftTouch;
            } else if (i === this.Levels.length - 1) { // Range all the way to the last cell on the column
                leftTouchNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(leftTouchStart, this.Levels[this.Levels.length - 1].LeftTouch);
                leftTouchStart = null;
            }
        } else if (leftTouchStart) { // Cell breaking the range of cells with non-sci impairment
            leftTouchNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(leftTouchStart, this.Levels[i - 1].LeftTouch);
            leftTouchStart = null;
        }
        
        //- RIGHT PRICK ------------------------------------
        if (level.RightPrick.HasImpairmentNotDueToSci) {
            if (level.RightPrick.EnteredByUser) {
                if (rightPrickStart) { // Consecutive cell with impairment not due to sci
                    rightPrickNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(rightPrickStart, this.Levels[i - 1].RightPrick);
                }

                if (level.Name === 'S4_5') {
                    rightPrickNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(level.RightPrick, level.RightPrick);
                }

                rightPrickStart = level.RightPrick;
            } else if (i === this.Levels.length - 1) { // Range all the way to the last cell on the column
                rightPrickNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(rightPrickStart, this.Levels[this.Levels.length - 1].RightPrick);
                rightPrickStart = null;
            }
        } else if (rightPrickStart) { // Cell breaking the range of cells with non-sci impairment
            rightPrickNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(rightPrickStart, this.Levels[i - 1].RightPrick);
            rightPrickStart = null;
        }
        
        //- LEFT PRICK ------------------------------------
        if (level.LeftPrick.HasImpairmentNotDueToSci) {
            if (level.LeftPrick.EnteredByUser) {
                if (leftPrickStart) { // Consecutive cell with impairment not due to sci
                    leftPrickNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(leftPrickStart, this.Levels[i - 1].LeftPrick);
                }

                if (level.Name === 'S4_5') {
                    leftPrickNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(level.LeftPrick, level.LeftPrick);
                }

                leftPrickStart = level.LeftPrick;
            } else if (i === this.Levels.length - 1) { // Range all the way to the last cell on the column
                leftPrickNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(leftPrickStart, this.Levels[this.Levels.length - 1].LeftPrick);
                leftPrickStart = null;
            }
        } else if (leftPrickStart) { // Cell breaking the range of cells with non-sci impairment
            leftPrickNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(leftPrickStart, this.Levels[i - 1].LeftPrick);
            leftPrickStart = null;
        }
        
        //- RIGHT MOTOR ------------------------------------
        if (level.RightMotor && level.RightMotor.HasImpairmentNotDueToSci) {
            if (level.RightMotor.EnteredByUser) {
                if (rightMotorStart) { // Consecutive cell with impairment not due to sci
                    rightMotorNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(rightMotorStart, lastRightMotor);
                }

                if (level.Name === 'S1') {
                    rightMotorNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(level.RightMotor, level.RightMotor);
                }

                rightMotorStart = level.RightMotor;
            } else if (level.Name === 'S1') { // Range all the way to the last cell on the column
                rightMotorNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(rightMotorStart, level.RightMotor);
                rightMotorStart = null;
            }

            lastRightMotor = level.RightMotor;
        } else if (level.RightMotor && rightMotorStart) { // Cell breaking the range of cells with non-sci impairment
            rightMotorNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(rightMotorStart, lastRightMotor);
            rightMotorStart = null;
        }
        
        //- LEFT MOTOR ------------------------------------
        if (level.LeftMotor && level.LeftMotor.HasImpairmentNotDueToSci) {
            if (level.LeftMotor.EnteredByUser) {
                if (leftMotorStart) { // Consecutive cell with impairment not due to sci
                    leftMotorNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(leftMotorStart, lastLeftMotor);
                }

                if (level.Name === 'S1') {
                    leftMotorNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(level.LeftMotor, level.LeftMotor);
                }

                leftMotorStart = level.LeftMotor;
            } else if (level.Name === 'S1') { // Range all the way to the last cell on the column
                leftMotorNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(leftMotorStart, lastLeftMotor);
                leftMotorStart = null;
            }

            lastLeftMotor = level.LeftMotor;
        } else if (level.LeftMotor && leftMotorStart) { // Cell breaking the range of cells with non-sci impairment
            leftMotorNonSciImpairment += this.GetNonSciImpairmentSummaryBetween(leftMotorStart, this.Levels[i - 1].LeftMotor);
            leftMotorStart = null;
        }
    }

    return rightTouchNonSciImpairment + rightPrickNonSciImpairment + rightMotorNonSciImpairment
        + leftTouchNonSciImpairment + leftPrickNonSciImpairment + leftMotorNonSciImpairment;
};

sci.neurology.IsncsciForm.prototype.GetNonSciImpairmentSummaryBetween = function (start, end) {
    var nonSciImpairment = start.Level.Name === end.Level.Name
                           ? '~' + start.Level.Name + ' ' + start.Side + ' ' + start.MeasurementType + ':'
        : '~' + start.Level.Name + ' to ' + end.Level.Name + ' ' + end.Side + ' ' + end.MeasurementType + ':';

    nonSciImpairment += ' ' + start.ReasonText;

    if (start.Comments && start.Comments.length > 0) {
        nonSciImpairment += ' - ' + start.Comments;
    }

    return nonSciImpairment + '\n';
};

sci.neurology.IsncsciForm.prototype.Dermatome_Updated = function (e) {
    this.UpdateObservers({ Dermatome:e.Sender, Type: 'DermatomeUpdated' });
};




sci.neurology.IsncsciFormLevel = function(name, ordinal, isKeyMuscle, isLowerMuscle) {
    this.IsKeyMuscle = isKeyMuscle;
    this.IsLowerMuscle = isLowerMuscle;

    this.RightTouch = new sci.neurology.Dermatome(this, 'Right', 'Touch');
    this.LeftTouch = new sci.neurology.Dermatome(this, 'Left', 'Touch');
    this.RightPrick = new sci.neurology.Dermatome(this, 'Right', 'Prick');
    this.LeftPrick = new sci.neurology.Dermatome(this, 'Left', 'Prick');
    this.RightMotor = isKeyMuscle ? new sci.neurology.Dermatome(this, 'Right', 'Motor') : null;
    this.LeftMotor = isKeyMuscle ? new sci.neurology.Dermatome(this, 'Left', 'Motor') : null;
    
    this.Previous = null;
    this.Name = name;
    this.Next = null;
    this.Ordinal = ordinal;
};

sci.InheritsFromClass(sci.neurology.IsncsciForm, 'sci.patterns.observer.Observable');

sci.Ready('sci.neurology.IsncsciForm');