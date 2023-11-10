import * as hash from 'password-hash';

export function hashPass(password: string) {

  const hashedPass = hash.generate(password)

  return {hashedPass}
}

export function verifyPass(candidatePass: string, hashedPass: string) {
  return hash.verify(candidatePass, hashedPass)
}