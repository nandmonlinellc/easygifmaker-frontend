export async function safeJson(response) {
  try {
    return await response.json()
  } catch (error) {
    return {}
  }
}

export function buildFormData(entries) {
  const formData = new FormData()
  entries.forEach(({ key, value, options }) => {
    if (value === undefined || value === null) {
      return
    }
    if (options) {
      formData.append(key, value, options)
    } else {
      formData.append(key, value)
    }
  })
  return formData
}
