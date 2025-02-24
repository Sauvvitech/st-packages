export interface IParamsCreateAnalytic {
    event: string;
    payload: any;
}
export interface IAnalyticProducer {
    createAnalytic(params: IParamsCreateAnalytic): Promise<void>;
}
