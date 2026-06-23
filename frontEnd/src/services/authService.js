import { get, post } from './api.js'

export async function loginUser(payload) {
  const { data } = await post('auth/login/', payload)
  return data
}

export async function createUserByAdmin(payload) {
  const { data } = await post('auth/users/', payload)
  return data
}

export async function fetchProfile() {
  const { data } = await get('auth/profile/')
  return data
}

export async function listUserAccounts() {
  const { data } = await get('auth/users/list/')
  return data
}
