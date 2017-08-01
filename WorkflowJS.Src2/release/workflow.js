var jswf;
(function (jswf) {
    function Activity(activity) {
        return activity;
    }
    jswf.Activity = Activity;
})(jswf || (jswf = {}));
var jswf;
(function (jswf) {
    var ActivityContext = (function () {
        function ActivityContext() {
        }
        return ActivityContext;
    }());
    jswf.ActivityContext = ActivityContext;
})(jswf || (jswf = {}));
var jswf;
(function (jswf) {
    var FlowchartInvoker = (function () {
        function FlowchartInvoker(flowchart) {
            var inputs = jswf.bll.workflow.GetValues(flowchart.$inputs, this.outInputs);
            this.context = jswf.bll.workflow.CreateContext(inputs, flowchart.$outputs, flowchart.$globals);
            this.flowchart = flowchart;
        }
        FlowchartInvoker.Createflowchart = function (flowchart) {
            return new FlowchartInvoker(flowchart);
        };
        FlowchartInvoker.prototype.setInputs = function (inputs) {
            this.outInputs = inputs;
            return this;
        };
        FlowchartInvoker.prototype.Invoke = function () {
            var firstActName = jswf.bll.workflow.GetFirstActivityName(this.flowchart.activities);
            this.ExecuteAct(firstActName);
        };
        FlowchartInvoker.prototype.ExecuteAct = function (actName) {
            var act = this.flowchart.activities[actName];
            this.context.runningActName = actName;
            this.context.runningAct = act;
            jswf.Helpers.ObjectHelpers.CombineObj(this.context.inputs, this.context.chartInputs, act.$inputs);
            do {
                try {
                    act.activity.Execute(this.context);
                }
                catch (e) {
                    jswf.Logger.log("error", e);
                }
                actName = jswf.bll.workflow.GetNextActivityName(this.context, act);
                act = this.flowchart.activities[actName];
            } while (act != null);
        };
        return FlowchartInvoker;
    }());
    jswf.FlowchartInvoker = FlowchartInvoker;
})(jswf || (jswf = {}));
var jswf;
(function (jswf) {
    var Logger = (function () {
        function Logger() {
        }
        Logger.SetLogger = function (logger) {
            Logger._logger = logger;
        };
        Logger.log = function (level) {
            var message = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                message[_i - 1] = arguments[_i];
            }
            var logger = Logger.getlogger();
            var msg = Logger.composeMsg(message);
            switch (level) {
                case "error":
                    logger.error(msg);
                case "":
            }
            logger.log();
        };
        Logger.getlogger = function () {
            if (Logger._logger)
                return Logger._logger;
            else
                return console;
        };
        Logger.composeMsg = function () {
            var msg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                msg[_i] = arguments[_i];
            }
            var res = "";
            msg.unshift((new Date()).toLocaleString());
            msg.unshift("workflowjs");
            msg.forEach(function (m) {
                res += m;
            });
            return res;
        };
        return Logger;
    }());
    jswf.Logger = Logger;
})(jswf || (jswf = {}));
var jswf;
(function (jswf) {
    var bll;
    (function (bll) {
        var workflow = (function () {
            function workflow() {
            }
            workflow.CreateContext = function (inputs, outputs, globals) {
                var context = new jswf.ActivityContext();
                context.inputs = inputs;
                context.outputs = outputs;
                context.globals = globals;
                return context;
            };
            workflow.GetValues = function (keys, values) {
                var result = {};
                keys = keys || [];
                if (keys == "*")
                    return values;
                else if (Array.isArray(keys)) {
                    keys.forEach(function (key) {
                        if (key in values) {
                            result[key] = values[key];
                        }
                        else {
                            result[key] = null;
                        }
                    });
                    return result;
                }
                return result;
            };
            workflow.GetFirstActivityName = function (activities) {
                return Object.keys(activities)[0];
            };
            workflow.GetNextActivityName = function (context, act) {
                return context.outputs["$next"] || act.next || "";
            };
            return workflow;
        }());
        bll.workflow = workflow;
    })(bll = jswf.bll || (jswf.bll = {}));
})(jswf || (jswf = {}));
var jswf;
(function (jswf) {
    var AssignActivity = (function () {
        function AssignActivity() {
        }
        AssignActivity.prototype.Terminate = function () {
            throw new Error("Method not implemented.");
        };
        AssignActivity.prototype.Execute = function (context) {
            Object.keys(context.inputs.values).forEach(function (key) {
                var v = context.inputs.values[key];
                var values = {};
                jswf.Helpers.ObjectHelpers.CombineObj({}, context.inputs, context.globals);
                context.outputs[key] = jswf.Helpers.EvalHelper.EvalWithContext(values, v);
            });
        };
        return AssignActivity;
    }());
    jswf.AssignActivity = AssignActivity;
})(jswf || (jswf = {}));
var jswf;
(function (jswf) {
    var Helpers;
    (function (Helpers) {
        var EvalHelper = (function () {
            function EvalHelper() {
            }
            EvalHelper.EvalWithContext = function (context, code) {
                function EvalContext() {
                    return eval(code);
                }
                return EvalContext.call(context);
            };
            return EvalHelper;
        }());
        Helpers.EvalHelper = EvalHelper;
    })(Helpers = jswf.Helpers || (jswf.Helpers = {}));
})(jswf || (jswf = {}));
var jswf;
(function (jswf) {
    var Helpers;
    (function (Helpers) {
        var ObjectHelpers = (function () {
            function ObjectHelpers() {
            }
            ObjectHelpers.CombineObj = function (target) {
                var source = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    source[_i - 1] = arguments[_i];
                }
                source.forEach(function (item) {
                    for (var i in item) {
                        target[i] = item[i];
                    }
                });
                return target;
            };
            return ObjectHelpers;
        }());
        Helpers.ObjectHelpers = ObjectHelpers;
    })(Helpers = jswf.Helpers || (jswf.Helpers = {}));
})(jswf || (jswf = {}));
