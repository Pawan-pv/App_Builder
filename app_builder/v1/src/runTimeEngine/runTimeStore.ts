const runtime: Record<string, any> = {};
const formErrors: Record<string, string> = {};

export function setRuntimeValue(key: string, value: any) {
  runtime[key] = value;
}

export function getRuntimeValue(key: string) {
  return runtime[key];
}

export function getRuntimeState() {
  return runtime;
}

/* -------- FORM ERRORS -------- */

export function setFormError(name: string, message: string) {
  formErrors[name] = message;
}

export function clearFormErrors() {
  Object.keys(formErrors).forEach(k => delete formErrors[k]);
}

export function getFormError(name: string) {
  return formErrors[name];
}
