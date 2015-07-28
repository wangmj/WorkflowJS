﻿module wfjsExample.Activities
{
    export var GetMathProblemWorkflow = () =>
    {
        return wfjs.Flowchart
        ({
            $outputs: ['correct'],

            activities:
            {
                'CreateMathProblem': wfjs.Activity
                ({
                    activity: new CreateMathActivity(),
                    $outputs: {
                        'problem': 'problem',
                        'solution': 'solution'
                    },
                    next: 'WaitForAnswer'
                }),
                'WaitForAnswer': wfjs.Pause
                ({
                    next: 'ValidateAnswer'
                }),
                'ValidateAnswer': wfjs.Assign
                ({
                    values:
                    {
                        'correct': 'this.solution == this.answer'
                    }
                })
            }
        });
    }
}