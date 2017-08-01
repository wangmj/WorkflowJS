module jswf {
    export interface IExecuteActivity {
        //输入
        inputs: string[],
        //输出
        outputs: string[],
        //执行
        Execute(context: ActivityContext): void;
        //中断
        Terminate(): void;
        next: string;
    }
}