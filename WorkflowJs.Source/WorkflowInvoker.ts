﻿module wfjs
{
    /**
     * WorkflowInvoker Activity or Workflow runner.
     */
    export class WorkflowInvoker
    {
        private _activity: IActivity;
        private _inputs: Dictionary<string> = null
        private _extensions: Dictionary<string> = null
        private _stateData: IPauseState = null;

        /**
         * CreateActivity Returns a WorkflowInvoker with attached activity.
         */
        constructor(activity: IActivity | IFlowchart)
        {
            if (_Specifications.IsExecutableActivity.IsSatisfiedBy(activity))
            {
                this._activity = <IActivity>activity;
            }
            else if (activity != null)
            {
                this._activity = new FlowchartActivity(<IFlowchart>activity);
            }
        }

        /**
         * CreateActivity Returns a WorkflowInvoker with attached activity.
         */
        public static CreateActivity(activity: IActivity | IFlowchart): WorkflowInvoker
        {
            return new WorkflowInvoker(activity);
        }

        /**
         * Inputs Sets the inputs for the IActivity.
         */
        public Inputs(inputs: Dictionary<any>): WorkflowInvoker
        {
            this._inputs = inputs;
            return this;
        }

        /**
         * State Sets the IPauseState for the IActivity.
         */
        public State(state: IPauseState): WorkflowInvoker
        {
            this._stateData = (<IInternalWorkflow><any>this._activity)._stateData = state;
            return this;
        }

        /**
         * Extensions Sets the extensions for the IActivity.
         */
        public Extensions(extensions: Dictionary<any>): WorkflowInvoker
        {
            this._extensions = extensions;
            return this;
        }

        /**
         * Invoke Executes the IActivity and returns an error or context.
         */
        public Invoke(callback?: (err: Error, context?: ActivityContext) => void): void
        {
            callback = callback || function(){};

            WorkflowInvoker._InvokeActivity(this._activity, this._inputs, this._stateData, this._extensions, (err: Error, context?: ActivityContext) =>
            {
                context = context || <ActivityContext>{};
                context.State = context.State || (err != null ? WorkflowState.Fault : WorkflowState.Complete);

                setTimeout(() => callback(err, context));
            });
        }

        /**
         * _InvokeActivity Creates an ActivityContext for the IActivity and calls the Execute method.
         */
        private static _InvokeActivity(activity: IActivity, inputs: Dictionary<string>, state: IPauseState, extensions: Dictionary<string>, callback: (err: Error, context?: ActivityContext) => void): void
        {
            if (activity == null)
            {
                return callback(null, <ActivityContext>{ Inputs: {}, Outputs: {} });
            }
            
            _bll.Workflow.CreateContext(activity, inputs, state, extensions, (err, context) =>
            {
                if (err != null)
                {
                    return callback(err, context);
                }

                WorkflowInvoker._ActivityExecuteAsync(activity, context, err =>
                {
                    if (err != null)
                    {
                        return callback(err, context);
                    }

                    _bll.Workflow.GetValueDictionary(activity.$outputs, context.Outputs, 'output', (err, values) =>
                    {
                        // ignore the errors from missing 'outputs'
                        if (_Specifications.IsPaused.IsSatisfiedBy(context))
                        {
                            err = null;
                        }

                        context.Outputs = values;
                        callback(err, context);
                    });
                });
            });
        }

        /**
         * _ActivityExecuteAsync Executes either Asynchronous or Synchronous Activity.
         */
        private static _ActivityExecuteAsync(activity: IActivity, context: ActivityContext, callback: (err?: Error) => void): void
        {
            if (_Specifications.IsExecuteAsync.IsSatisfiedBy(activity.Execute))
            {
                try
                {
                    activity.Execute(context, callback);
                }
                catch (err)
                {
                    callback(err);
                }
            }
            else
            {
                try
                {
                    activity.Execute(context);
                }
                catch (err)
                {
                    return callback(err);
                }

                callback();
            }
        }
    }
} 