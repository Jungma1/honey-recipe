import { UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export type Function = (...args: any[]) => any;

export type UseMutationOptionsType<T extends Function> = UseMutationOptions<
  Awaited<ReturnType<T>>,
  AxiosError,
  Parameters<T>[0]
>;
