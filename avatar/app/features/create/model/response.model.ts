export interface ResponseModel<T>{
  data:T,
  error?:any[],
  status:number
}
