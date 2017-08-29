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
sci.Provide('sci.neurology.Dermatome');

sci.neurology.Dermatome = function (level, side, measurementType) {
    sci.patterns.observer.Observable.call(this);
    
    this.Level = level;
    this.Side = side;
    this.MeasurementType = measurementType;
    this.Value = '';
    this.EnteredByUser = false;
    this.HasImpairmentNotDueToSci = false;
    this.Reason = null;
    this.ReasonText = '';
    this.Comments = '';
};

sci.neurology.Dermatome.prototype.UpdateValues = function (value, enteredByUser, hasImpairmentNotDueToSci, reason, reasonText, comments) {
    this.Value = value;
    this.EnteredByUser = enteredByUser;
    this.HasImpairmentNotDueToSci = hasImpairmentNotDueToSci;
    this.Reason = reason;
    this.ReasonText = reasonText;
    this.Comments = comments;

    this.UpdateObservers({ Type: 'Updated' });
};
        
sci.InheritsFromClass(sci.neurology.Dermatome, 'sci.patterns.observer.Observable');

sci.Ready('sci.neurology.Dermatome');