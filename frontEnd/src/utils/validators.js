export function required(value) {
  if (value == null || String(value).trim() === '') return 'This field is required.'
  return ''
}
