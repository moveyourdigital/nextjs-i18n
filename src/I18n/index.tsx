import useI18n, {
  I18nLocale,
  I18nParams,
  I18nPluralValue,
  I18nSingleValue,
} from "../hook/useI18n"
import React, { FC } from "react"

type I18nProps =
  | Record<I18nLocale, I18nSingleValue | I18nPluralValue>
  | {
      count?: number
      params?: I18nParams
    }

const I18n: FC<I18nProps> = (props) => {
  const { params, count, ...texts } = props
  const { t } = useI18n()
  return (
    <React.Fragment>
      {t(texts as Record<I18nLocale, I18nSingleValue | I18nPluralValue>, {
        params: params as I18nParams,
        count: count as number,
      })}
    </React.Fragment>
  )
}

export default I18n
