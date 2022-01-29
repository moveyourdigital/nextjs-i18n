import mockConsole from "jest-mock-console"
import useI18n from "./useI18n"

const i18n = {
  locale: "pt",
  locales: ["en", "pt"],
  defaultLocale: "en",
}

jest.mock("next/router", () => ({
  useRouter: () => i18n,
}))

describe("useI18n", () => {
  beforeEach(() => {
    mockConsole()
  })

  describe("t", () => {
    const { t } = useI18n()

    it.each`
      count
      ${"0"}
      ${"1"}
      ${"2"}
      ${"42"}
    `("returns the string for $count messages", ({ count }) => {
      const result = t(
        {
          pt: {
            0: 'Olá {{name}}. Não tem <link>mensagens</link> do dia <b>{{today "d/m/Y"}}</b>',
            1: 'Olá {{name}}. Tem {{count}} <link>mensagem</link> do dia <b>{{today "d/m/Y"}}</b>',
            n: 'Olá {{name}}. Tem {{count}} <link>mensagens</link> do dia <b>{{today "d/m/Y"}}</b>',
          },
          en: {
            0: 'Hi {{name}}. No <link>messages</link> for <b>{{today "m/d/Y"}}</b>',
            1: 'Hi {{name}}. You have {{count}} <link>message</link> for <b>{{today "m/d/Y"}}</b>',
            n: 'Hi {{name}}. You have {{count}} <link>messages</link> for <b>{{today "m/d/Y"}}</b>',
          },
        },
        {
          count,
          params: {
            name: "Jane Doe",
            count,
            link: <a href="/messages" />,
            b: <strong />,
            today: (format: string) => {
              const date = new Date("2021-02-28")
              return format.replace(/d|m|Y/g, (match) => {
                switch (match) {
                  case "d":
                    return date.getDate().toString()
                  case "m":
                    return (date.getMonth() + 1).toString()
                  case "Y":
                    return date.getFullYear().toString()
                }
              })
            },
          },
        },
      )

      expect(result).toMatchSnapshot()
    })
  })
})
