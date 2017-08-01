module jswf.Helpers {
    export class ObjectHelpers {
        public static CombineObj(target: Dictionary<any>, ...source: Dictionary<any>[]): Dictionary<any> {
            source.forEach((item) => {
                for (var i in item) {
                    target[i] = item[i];
                }
            });
            return target;
        }
    }
}