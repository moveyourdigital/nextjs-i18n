import useI18n, {
  I18nLocale,
  I18nParams,
  I18nPluralValue,
  I18nSingleValue,
} from "../hook/useI18n"
import { FC } from "react"

type I18nProps =
  | Record<I18nLocale, I18nSingleValue | I18nPluralValue> & {
      count?: number
      params?: I18nParams
    }

const I18n: FC<I18nProps> = (props) => {
  const { params, count, ...texts } = props
  const { t } = useI18n()
  if (texts.children) {
    throw new Error("I18n component must not have children")
  }
  return (
    <>
      {t(texts as Record<I18nLocale, I18nSingleValue | I18nPluralValue>, {
        params,
        count,
      })}
    </>
  )
}

export default I18n
