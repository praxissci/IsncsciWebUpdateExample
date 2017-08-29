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
using System.Text.RegularExpressions;
using Rhi.Isncsci;

namespace Isncsci.Web.Models.Algorithm
{
    public class NeurologyFormModel
    {
        public BinaryObservation AnalContraction { get; set; }
        public BinaryObservation AnalSensation { get; set; }
        public string RightLowestNonKeyMuscleWithMotorFunction { get; set; }
        public string LeftLowestNonKeyMuscleWithMotorFunction { get; set; }

        // C2
        public string C2RightTouch { get; set; }
        public string C2LeftTouch { get; set; }
        public string C2RightPrick { get; set; }
        public string C2LeftPrick { get; set; }

        // C3
        public string C3RightTouch { get; set; }
        public string C3LeftTouch { get; set; }
        public string C3RightPrick { get; set; }
        public string C3LeftPrick { get; set; }

        // C4
        public string C4RightTouch { get; set; }
        public string C4LeftTouch { get; set; }
        public string C4RightPrick { get; set; }
        public string C4LeftPrick { get; set; }

        // C5
        public string C5RightMotor { get; set; }
        public string C5LeftMotor { get; set; }
        public string C5RightTouch { get; set; }
        public string C5LeftTouch { get; set; }
        public string C5RightPrick { get; set; }
        public string C5LeftPrick { get; set; }

        // C6
        public string C6RightMotor { get; set; }
        public string C6LeftMotor { get; set; }
        public string C6RightTouch { get; set; }
        public string C6LeftTouch { get; set; }
        public string C6RightPrick { get; set; }
        public string C6LeftPrick { get; set; }

        // C7
        public string C7RightMotor { get; set; }
        public string C7LeftMotor { get; set; }
        public string C7RightTouch { get; set; }
        public string C7LeftTouch { get; set; }
        public string C7RightPrick { get; set; }
        public string C7LeftPrick { get; set; }

        // C8
        public string C8RightMotor { get; set; }
        public string C8LeftMotor { get; set; }
        public string C8RightTouch { get; set; }
        public string C8LeftTouch { get; set; }
        public string C8RightPrick { get; set; }
        public string C8LeftPrick { get; set; }

        // T1
        public string T1RightMotor { get; set; }
        public string T1LeftMotor { get; set; }
        public string T1RightTouch { get; set; }
        public string T1LeftTouch { get; set; }
        public string T1RightPrick { get; set; }
        public string T1LeftPrick { get; set; }

        // T2
        public string T2RightTouch { get; set; }
        public string T2LeftTouch { get; set; }
        public string T2RightPrick { get; set; }
        public string T2LeftPrick { get; set; }

        // T3
        public string T3RightTouch { get; set; }
        public string T3LeftTouch { get; set; }
        public string T3RightPrick { get; set; }
        public string T3LeftPrick { get; set; }

        // T4
        public string T4RightTouch { get; set; }
        public string T4LeftTouch { get; set; }
        public string T4RightPrick { get; set; }
        public string T4LeftPrick { get; set; }

        // T5
        public string T5RightTouch { get; set; }
        public string T5LeftTouch { get; set; }
        public string T5RightPrick { get; set; }
        public string T5LeftPrick { get; set; }

        // T6
        public string T6RightTouch { get; set; }
        public string T6LeftTouch { get; set; }
        public string T6RightPrick { get; set; }
        public string T6LeftPrick { get; set; }

        // T7
        public string T7RightTouch { get; set; }
        public string T7LeftTouch { get; set; }
        public string T7RightPrick { get; set; }
        public string T7LeftPrick { get; set; }

        // T8
        public string T8RightTouch { get; set; }
        public string T8LeftTouch { get; set; }
        public string T8RightPrick { get; set; }
        public string T8LeftPrick { get; set; }

        // T9
        public string T9RightTouch { get; set; }
        public string T9LeftTouch { get; set; }
        public string T9RightPrick { get; set; }
        public string T9LeftPrick { get; set; }

        // T10
        public string T10RightTouch { get; set; }
        public string T10LeftTouch { get; set; }
        public string T10RightPrick { get; set; }
        public string T10LeftPrick { get; set; }

        // T11
        public string T11RightTouch { get; set; }
        public string T11LeftTouch { get; set; }
        public string T11RightPrick { get; set; }
        public string T11LeftPrick { get; set; }

        // T12
        public string T12RightTouch { get; set; }
        public string T12LeftTouch { get; set; }
        public string T12RightPrick { get; set; }
        public string T12LeftPrick { get; set; }

        // L1
        public string L1RightTouch { get; set; }
        public string L1LeftTouch { get; set; }
        public string L1RightPrick { get; set; }
        public string L1LeftPrick { get; set; }

        // L2
        public string L2RightMotor { get; set; }
        public string L2LeftMotor { get; set; }
        public string L2RightTouch { get; set; }
        public string L2LeftTouch { get; set; }
        public string L2RightPrick { get; set; }
        public string L2LeftPrick { get; set; }

        // L3
        public string L3RightMotor { get; set; }
        public string L3LeftMotor { get; set; }
        public string L3RightTouch { get; set; }
        public string L3LeftTouch { get; set; }
        public string L3RightPrick { get; set; }
        public string L3LeftPrick { get; set; }

        // L4
        public string L4RightMotor { get; set; }
        public string L4LeftMotor { get; set; }
        public string L4RightTouch { get; set; }
        public string L4LeftTouch { get; set; }
        public string L4RightPrick { get; set; }
        public string L4LeftPrick { get; set; }

        // L5
        public string L5RightMotor { get; set; }
        public string L5LeftMotor { get; set; }
        public string L5RightTouch { get; set; }
        public string L5LeftTouch { get; set; }
        public string L5RightPrick { get; set; }
        public string L5LeftPrick { get; set; }

        // S1
        public string S1RightMotor { get; set; }
        public string S1LeftMotor { get; set; }
        public string S1RightTouch { get; set; }
        public string S1LeftTouch { get; set; }
        public string S1RightPrick { get; set; }
        public string S1LeftPrick { get; set; }

        // S2
        public string S2RightTouch { get; set; }
        public string S2LeftTouch { get; set; }
        public string S2RightPrick { get; set; }
        public string S2LeftPrick { get; set; }

        // S3
        public string S3RightTouch { get; set; }
        public string S3LeftTouch { get; set; }
        public string S3RightPrick { get; set; }
        public string S3LeftPrick { get; set; }

        // S4-5
        public string S4_5RightTouch { get; set; }
        public string S4_5LeftTouch { get; set; }
        public string S4_5RightPrick { get; set; }
        public string S4_5LeftPrick { get; set; }

        public void BindTo(NeurologyForm neurologyForm)
        {
            neurologyForm.AnalContraction = AnalContraction;
            neurologyForm.AnalSensation = AnalSensation;

            if (!string.IsNullOrEmpty(RightLowestNonKeyMuscleWithMotorFunction))
                neurologyForm.SetRightLowestNonKeyMuscleWithMotorFunction(RightLowestNonKeyMuscleWithMotorFunction);

            if (!string.IsNullOrEmpty(LeftLowestNonKeyMuscleWithMotorFunction))
                neurologyForm.SetLeftLowestNonKeyMuscleWithMotorFunction(LeftLowestNonKeyMuscleWithMotorFunction);

            neurologyForm.UpdateLevelAt("C2", C2RightTouch, C2LeftTouch, C2RightPrick, C2LeftPrick, "0", "0");
            neurologyForm.UpdateLevelAt("C3", C3RightTouch, C3LeftTouch, C3RightPrick, C3LeftPrick, "0", "0");
            neurologyForm.UpdateLevelAt("C4", C4RightTouch, C4LeftTouch, C4RightPrick, C4LeftPrick, "0", "0");
            neurologyForm.UpdateLevelAt("C5", C5RightTouch, C5LeftTouch, C5RightPrick, C5LeftPrick, C5RightMotor, C5LeftMotor);
            neurologyForm.UpdateLevelAt("C6", C6RightTouch, C6LeftTouch, C6RightPrick, C6LeftPrick, C6RightMotor, C6LeftMotor);
            neurologyForm.UpdateLevelAt("C7", C7RightTouch, C7LeftTouch, C7RightPrick, C7LeftPrick, C7RightMotor, C7LeftMotor);
            neurologyForm.UpdateLevelAt("C8", C8RightTouch, C8LeftTouch, C8RightPrick, C8LeftPrick, C8RightMotor, C8LeftMotor);
            neurologyForm.UpdateLevelAt("T1", T1RightTouch, T1LeftTouch, T1RightPrick, T1LeftPrick, T1RightMotor, T1LeftMotor);
            neurologyForm.UpdateLevelAt("T2", T2RightTouch, T2LeftTouch, T2RightPrick, T2LeftPrick, "0", "0");
            neurologyForm.UpdateLevelAt("T3", T3RightTouch, T3LeftTouch, T3RightPrick, T3LeftPrick, "0", "0");
            neurologyForm.UpdateLevelAt("T4", T4RightTouch, T4LeftTouch, T4RightPrick, T4LeftPrick, "0", "0");
            neurologyForm.UpdateLevelAt("T5", T5RightTouch, T5LeftTouch, T5RightPrick, T5LeftPrick, "0", "0");
            neurologyForm.UpdateLevelAt("T6", T6RightTouch, T6LeftTouch, T6RightPrick, T6LeftPrick, "0", "0");
            neurologyForm.UpdateLevelAt("T7", T7RightTouch, T7LeftTouch, T7RightPrick, T7LeftPrick, "0", "0");
            neurologyForm.UpdateLevelAt("T8", T8RightTouch, T8LeftTouch, T8RightPrick, T8LeftPrick, "0", "0");
            neurologyForm.UpdateLevelAt("T9", T9RightTouch, T9LeftTouch, T9RightPrick, T9LeftPrick, "0", "0");
            neurologyForm.UpdateLevelAt("T10", T10RightTouch, T10LeftTouch, T10RightPrick, T10LeftPrick, "0", "0");
            neurologyForm.UpdateLevelAt("T11", T11RightTouch, T11LeftTouch, T11RightPrick, T11LeftPrick, "0", "0");
            neurologyForm.UpdateLevelAt("T12", T12RightTouch, T12LeftTouch, T12RightPrick, T12LeftPrick, "0", "0");
            neurologyForm.UpdateLevelAt("L1", L1RightTouch, L1LeftTouch, L1RightPrick, L1LeftPrick, "0", "0");
            neurologyForm.UpdateLevelAt("L2", L2RightTouch, L2LeftTouch, L2RightPrick, L2LeftPrick, L2RightMotor, L2LeftMotor);
            neurologyForm.UpdateLevelAt("L3", L3RightTouch, L3LeftTouch, L3RightPrick, L3LeftPrick, L3RightMotor, L3LeftMotor);
            neurologyForm.UpdateLevelAt("L4", L4RightTouch, L4LeftTouch, L4RightPrick, L4LeftPrick, L4RightMotor, L4LeftMotor);
            neurologyForm.UpdateLevelAt("L5", L5RightTouch, L5LeftTouch, L5RightPrick, L5LeftPrick, L5RightMotor, L5LeftMotor);
            neurologyForm.UpdateLevelAt("S1", S1RightTouch, S1LeftTouch, S1RightPrick, S1LeftPrick, S1RightMotor, S1LeftMotor);
            neurologyForm.UpdateLevelAt("S2", S2RightTouch, S2LeftTouch, S2RightPrick, S2LeftPrick, "0", "0");
            neurologyForm.UpdateLevelAt("S3", S3RightTouch, S3LeftTouch, S3RightPrick, S3LeftPrick, "0", "0");
            neurologyForm.UpdateLevelAt("S4_5", S4_5RightTouch, S4_5LeftTouch, S4_5RightPrick, S4_5LeftPrick, "0", "0");
        }
    }
}