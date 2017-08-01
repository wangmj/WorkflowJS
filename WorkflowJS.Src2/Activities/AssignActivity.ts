module jswf {
    export class AssignActivity implements IExecuteActivity {
        inputs: string[];
        outputs: string[];
        Terminate(): void {
            throw new Error("Method not implemented.");
        }
        next: string;

        public Execute(context: ActivityContext): void {
            Object.keys(context.inputs.values).forEach((key) => {
                var v = context.inputs.values[key];
                var values = {};
                Helpers.ObjectHelpers.CombineObj({}, context.inputs, context.globals);
                context.outputs[key] = Helpers.EvalHelper.EvalWithContext(values, v);
            });
        }
    }
}