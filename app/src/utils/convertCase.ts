type GenericType = {
  [index: string]: any
}

export const strToCamelCase = (str: string): string =>
  str.replace(
    /([-_]\w)/g,
    word => word[1].toUpperCase()
  )

export const objToCamelCase = (obj: GenericType): GenericType => {
  const camelCased: GenericType = {}

  Object.keys(obj).map(
    (key:string) => camelCased[strToCamelCase(key)] = obj[key] as unknown
  )

  return camelCased
}

