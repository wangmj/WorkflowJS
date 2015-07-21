var wfjs;
(function (wfjs) {
    var Activities;
    (function (Activities) {
        Activities.GetTypeActivity = {
            $outputs: ['result'],
            activities: {
                'GetUserInput': {
                    activity: new wfjs.Activities.PromptActivity(),
                    $inputs: {
                        message: '"Enter either a number or a string."'
                    },
                    $outputs: { 'result': 'input' },
                    next: 'SetInputType'
                },
                'SetInputType': {
                    execute: function (context, done) {
                        var input = context.Inputs['input'];
                        if (!isNaN(input) && input != null && input.trim() != '') {
                            input = parseFloat(input);
                        }
                        /* this is a fix for typeof null returning object. */
                        var inputType = input == null || input == '' ? 'null' : (typeof input);
                        context.Outputs['inputType'] = inputType;
                        done();
                    },
                    next: 'Switch:DisplayInputType'
                },
                'Switch:DisplayInputType': {
                    execute: function (context, done) {
                        var inputType = context.Inputs['inputType'];
                        switch (inputType) {
                            case 'null':
                            case 'undefined':
                                this.next = 'CreateMessage:NoValue';
                                break;
                            case 'string':
                                this.next = 'CreateMessage:String';
                                break;
                            case 'number':
                                this.next = 'CreateMessage:Number';
                                break;
                            default:
                                this.next = 'CreateMessage:Unknown';
                                break;
                        }
                        done();
                    },
                    next: null
                },
                'CreateMessage:NoValue': { output: 'result', value: '"You did not enter a value!"' },
                'CreateMessage:String': { output: 'result', value: '"You entered a string!"' },
                'CreateMessage:Number': { output: 'result', value: '"You entered a number!"' },
                'CreateMessage:Unknown': { output: 'result', value: '"You entered something unknown!"' }
            },
        };
    })(Activities = wfjs.Activities || (wfjs.Activities = {}));
})(wfjs || (wfjs = {}));
//# sourceMappingURL=GetTypeActivity.js.map