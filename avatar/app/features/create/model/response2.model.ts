export interface Response2Model<T> {
  data: T;
  error?: any[];
  status: number;
}
