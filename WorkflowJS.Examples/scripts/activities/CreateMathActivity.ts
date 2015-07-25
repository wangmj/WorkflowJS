﻿module wfjsExample.Activities
{
    export class CreateMathActivity implements wfjs.IActivity
    {
        public $outputs = ['problem', 'solution'];

        public Execute(context: wfjs.ActivityContext, done: (err?: Error) => void): void
        {
            var number1 = Math.floor((Math.random() * 10) + 1);
            var number2 = Math.floor((Math.random() * 10) + 1);

            context.Outputs['problem'] = number1 + ' + ' + number2;
            context.Outputs['solution'] = number1 + number2;

            done();
        }
    }
}