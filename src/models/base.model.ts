export class GenericResponse<R = Record<string, unknown>> {
  message!: string;
  isSuccessful!: boolean;
  result!: R;
}
