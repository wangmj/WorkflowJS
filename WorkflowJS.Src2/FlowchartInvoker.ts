module jswf {
    export class FlowchartInvoker {
        public context: ActivityContext;
        public outInputs: Dictionary<any>;
        private flowchart: IFlowchart;
        constructor(flowchart: IFlowchart) {
            var inputs = bll.workflow.GetValues(flowchart.$inputs, this.outInputs);
            this.context = bll.workflow.CreateContext(inputs, flowchart.$outputs, flowchart.$globals);
            this.flowchart = flowchart;
        }
        public static Createflowchart(flowchart: IFlowchart) {
            return new FlowchartInvoker(flowchart);
        }
        public setInputs(inputs: Dictionary<any>): FlowchartInvoker {
            this.outInputs = inputs;
            return this;
        }
        public Invoke(): void {
            //1.获取第一个activity
            //2.execute 
            var firstActName = bll.workflow.GetFirstActivityName(this.flowchart.activities);
            this.ExecuteAct(firstActName);
        }
        private ExecuteAct(actName: string) {

            var act = this.flowchart.activities[actName];
            this.context.runningActName = actName;
            this.context.runningAct = act;
            //将flowchart的输入和本次的输入合在一起
            Helpers.ObjectHelpers.CombineObj(this.context.inputs, this.context.chartInputs, act.$inputs);
            do {
                try {
                    act.activity.Execute(this.context);
                } catch (e) {
                    Logger.log("error", e);
                }
                actName = bll.workflow.GetNextActivityName(this.context, act);
                act = this.flowchart.activities[actName];
            }
            while (act != null)
        }
    }
}