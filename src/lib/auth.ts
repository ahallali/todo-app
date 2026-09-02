// Prototype helpers retained for historical tests; public credential routes redirect to the demo.

export async function login(_email: string, _password: string) {
  return { success: true };
}

export async function signup(_name: string, _email: string, _password: string) {
  return { success: true };
}
