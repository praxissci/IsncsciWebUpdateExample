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
using Isncsci.Web.Models.Algorithm;
using System.Web.Mvc;

namespace Isncsci.Web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var model = new NeurologyFormModel
            {
                AnalContraction = Rhi.Isncsci.BinaryObservation.Yes,
                AnalSensation = Rhi.Isncsci.BinaryObservation.No
            };

            return View();
        }

        public JsonResult FormData()
        {
            var model = new NeurologyFormModel
            {
                AnalContraction = Rhi.Isncsci.BinaryObservation.Yes,
                AnalSensation = Rhi.Isncsci.BinaryObservation.No,
                C2LeftPrick = "2",
                C2LeftTouch = "2",
                C2RightPrick = "2",
                C2RightTouch = "2",
                C3LeftPrick = "2",
                C3LeftTouch = "2",
                C3RightPrick = "2",
                C3RightTouch = "2",
                C4LeftPrick = "2",
                C4LeftTouch = "2",
                C4RightPrick = "2",
                C4RightTouch = "2",
                C5LeftMotor = "5",
                C5LeftPrick = "2",
                C5LeftTouch = "2",
                C5RightMotor = "5",
                C5RightPrick = "2",
                C5RightTouch = "2",
                C6LeftMotor = "5",
                C6LeftPrick = "2",
                C6LeftTouch = "2",
                C6RightMotor = "5",
                C6RightPrick = "2",
                C6RightTouch = "2",
                C7LeftMotor = "5",
                C7LeftPrick = "2",
                C7LeftTouch = "2",
                C7RightMotor = "5",
                C7RightPrick = "2",
                C7RightTouch = "2",
                C8LeftMotor = "5",
                C8LeftPrick = "2",
                C8LeftTouch = "2",
                C8RightMotor = "5",
                C8RightPrick = "2",
                C8RightTouch = "2",
                T1LeftMotor = "5",
                T1LeftPrick = "2",
                T1LeftTouch = "2",
                T1RightMotor = "5",
                T1RightPrick = "2",
                T1RightTouch = "2",
                T2LeftPrick = "2",
                T2LeftTouch = "2",
                T2RightPrick = "2",
                T2RightTouch = "2",
                T3LeftPrick = "2",
                T3LeftTouch = "2",
                T3RightPrick = "2",
                T3RightTouch = "2",
                T4LeftPrick = "2",
                T4LeftTouch = "2",
                T4RightPrick = "2",
                T4RightTouch = "2",
                T5LeftPrick = "2",
                T5LeftTouch = "2",
                T5RightPrick = "2",
                T5RightTouch = "2",
                T6LeftPrick = "2",
                T6LeftTouch = "2",
                T6RightPrick = "2",
                T6RightTouch = "2",
                T7LeftPrick = "2",
                T7LeftTouch = "2",
                T7RightPrick = "2",
                T7RightTouch = "2",
                T8LeftPrick = "2",
                T8LeftTouch = "2",
                T8RightPrick = "2",
                T8RightTouch = "2",
                T9LeftPrick = "2",
                T9LeftTouch = "2",
                T9RightPrick = "2",
                T9RightTouch = "2",
                T10LeftPrick = "2",
                T10LeftTouch = "2",
                T10RightPrick = "2",
                T10RightTouch = "2",
                T11LeftPrick = "2",
                T11LeftTouch = "2",
                T11RightPrick = "2",
                T11RightTouch = "2",
                T12LeftPrick = "2",
                T12LeftTouch = "2",
                T12RightPrick = "2",
                T12RightTouch = "2",
                L1LeftPrick = "2",
                L1LeftTouch = "2",
                L1RightPrick = "2",
                L1RightTouch = "2",
                L2LeftMotor = "5",
                L2LeftPrick = "2",
                L2LeftTouch = "2",
                L2RightMotor = "5",
                L2RightPrick = "2",
                L2RightTouch = "2",
                L3LeftMotor = "5",
                L3LeftPrick = "2",
                L3LeftTouch = "2",
                L3RightMotor = "5",
                L3RightPrick = "2",
                L3RightTouch = "2",
                L4LeftMotor = "5",
                L4LeftPrick = "2",
                L4LeftTouch = "2",
                L4RightMotor = "5",
                L4RightPrick = "2",
                L4RightTouch = "2",
                L5LeftMotor = "5",
                L5LeftPrick = "2",
                L5LeftTouch = "2",
                L5RightMotor = "5",
                L5RightPrick = "2",
                L5RightTouch = "2",
                S1LeftMotor = "5",
                S1LeftPrick = "2",
                S1LeftTouch = "2",
                S1RightMotor = "5",
                S1RightPrick = "2",
                S1RightTouch = "2",
                S2LeftPrick = "2",
                S2LeftTouch = "2",
                S2RightPrick = "2",
                S2RightTouch = "2",
                S3LeftPrick = "2",
                S3LeftTouch = "2",
                S3RightPrick = "2",
                S3RightTouch = "2",
                S4_5LeftPrick = "2",
                S4_5LeftTouch = "2",
                S4_5RightPrick = "2",
                S4_5RightTouch = "2"
            };

            return this.Json(model);
        }

        /// <summary>
        /// Called to request the Asia Man SVG component of the ISNCSCI form
        /// </summary>
        /// <returns>SVG code required to render the Asia Man as inline svg</returns>
        public ActionResult AsiaManSvg()
        {
            return View();
        }
    }
}