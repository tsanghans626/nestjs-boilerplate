import { TransformFnParams } from 'class-transformer/types/interfaces';

export function stringToNumberTransformer(params: TransformFnParams) {
  return params.value ? Number(params.value) : undefined;
}

export function tzStringToDate(params: TransformFnParams) {
  return params.value ? new Date(params.value) : undefined;
}
