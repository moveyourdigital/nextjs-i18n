import { useRouter } from "next/router"
import { ReactNode, ReactText, isValidElement, cloneElement } from "react"

export type I18nLocale = Exclude<string, "count" | "params">
export type I18nParam = ReactText | ReactNode
export type I18nSingleValue = ReactText
export type I18nPluralValue = { [n: number]: ReactText; n?: ReactText }
export type I18nParams = Record<string, I18nParam> & { count?: number }

export type TranslateFn = (
  locales: Record<I18nLocale, I18nSingleValue | I18nPluralValue>,
  args: {
    params?: I18nParams
    count?: number
  },
) => ReactText | ReactNode

const TAG_REGEXP = /<([a-z0-9_-]+)\b[^>]*>(.*?)<\/\1>/gi
const STR_REGEXP = /{{([a-z0-9_-]+)\s*(.*?)}}/gi

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

    throw new Error(`No string defined for ${defaultLocale}`)
  }

  const getValue = (
    locales: Record<I18nLocale, I18nSingleValue | I18nPluralValue>,
    count?: number,
  ) => {
    const value = getBest(locales)
    if (typeof value === "object") {
      if (count in value) {
        return value[count]
      } else {
        return value["n"]
      }
    } else {
      return value
    }
  }

  const t: TranslateFn = (locales, args) => {
    let value = getValue(locales, args?.count)

    if (args?.params) {
      value = value.toString().replace(STR_REGEXP, function (_, variable, arg) {
        const substitute = args.params[variable]
        if (typeof substitute === "function") {
          return substitute(arg)
        } else {
          return substitute.toString()
        }
      })

      if (TAG_REGEXP.test(value)) {
        return value.split(TAG_REGEXP).map((part, i, array) => {
          // must match 2nd and 3rd param on a group of four
          // see tests for example
          if (i % 3 === 1) {
            const element = args.params[part]
            if (!isValidElement(element)) {
              throw new Error(
                "I18n received a non JSX element. Only use <tag> substitutes when variables are meant to be replaced by JSX elements.",
              )
            }
            // empty the next one, which is a child element
            const child = array[i + 1]
            array[i + 1] = ""
            return cloneElement(element, {
              ...element.props,
              key: i,
              children: child,
            })
          } else {
            return part
          }
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
