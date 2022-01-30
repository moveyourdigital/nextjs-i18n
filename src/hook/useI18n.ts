import { useRouter } from "next/router"
import React from "react"
import dlv from "dlv"

export type I18nLocale = Exclude<string, "count" | "params">
// @ts-expect-error circular reference
export type I18nSimpleParam = string | number | Record<string, I18nSimpleParam>

export type I18nParam =
  | I18nSimpleParam
  | JSX.Element
  | ((arg: string, args: I18nParams) => string)
export type I18nSingleValue = string
export type I18nPluralValue = {
  [n: number]: string
  n?: string
}
export type I18nParams = Record<string, I18nParam> & { count?: number }

export type TranslateFn = (
  locales: Record<I18nLocale, I18nSingleValue | I18nPluralValue>,
  args?: {
    params?: I18nParams
    count?: number
  },
) => string | JSX.Element | JSX.Element[]

const TAG_REGEXP = /<([a-z0-9_-]+)\b[^>]*>(.*?)<\/\1>/gi
const STR_REGEXP = /{{([a-z0-9._-]+)\s*(.*?)}}/gi
const LITERAL_REGEXP = /^"(.*)"$/i

function useI18n() {
  const { locale, locales, defaultLocale } = useRouter()

  const getBest = (
    locales: Record<I18nLocale, I18nSingleValue | I18nPluralValue>,
  ) => {
    if (locale && locale in locales) {
      return locales[locale]
    }

    if (defaultLocale && defaultLocale in locales) {
      return locales[defaultLocale]
    }

    throw new Error(`I18n no string for ${defaultLocale}`)
  }

  const getValue = (
    locales: Record<I18nLocale, I18nSingleValue | I18nPluralValue>,
    count?: number,
  ) => {
    const value = getBest(locales)
    return typeof value === "object"
      ? count in value
        ? value[count]
        : value["n"]
      : value
  }

  const t: TranslateFn = (locales, args) => {
    let value = getValue(locales, args?.count)

    if (args?.params) {
      value = value
        .toString()
        .replace(STR_REGEXP, function (_, variable: string, arg: string) {
          const substitute = dlv(args.params, variable)
          return typeof substitute === "function"
            ? substitute(
                LITERAL_REGEXP.test(arg)
                  ? arg.substring(1, arg.length - 1)
                  : dlv(args.params, arg),
              )
            : substitute.toString()
        })

      if (TAG_REGEXP.test(value)) {
        return value.split(TAG_REGEXP).map((part, i, array) => {
          // must match 2nd and 3rd param on a group of four
          // see tests for example
          if (i % 3 !== 1) return part as unknown as JSX.Element

          const element = dlv(args.params, part)
          if (!React.isValidElement(element)) {
            throw new Error(`I18n non JSX in <${part}>.`)
          }
          // empty the next one, which is a child element
          const child = array[i + 1]
          array[i + 1] = ""

          return React.cloneElement(element, {
            // @ts-expect-error JSX props type is unknown
            ...element.props,
            key: i,
            children: child,
          }) as JSX.Element
        })
      }
    }

    return value
  }

  return {
    t,
    locale,
    locales,
    defaultLocale,
  }
}

export default useI18n
