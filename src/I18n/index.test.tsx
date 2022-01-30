import { create } from "react-test-renderer"
import mockConsole from "jest-mock-console"
import I18n from "."

const i18n = {
  locale: "pt",
  locales: ["en", "pt"],
  defaultLocale: "en",
}

jest.mock("next/router", () => ({
  useRouter: () => i18n,
}))

describe("<I18n />", () => {
  beforeEach(() => {
    mockConsole()
  })

  describe("when passing pt and en", () => {
    it("renders pt text", () => {
      expect(create(<I18n pt="Olá" en="Hello" />).toJSON()).toMatchSnapshot()
    })
  })

  describe("when passing plurals", () => {
    it.each`
      count
      ${"0"}
      ${"1"}
      ${"2"}
      ${"3"}
      ${"42"}
    `("renders plural form of $count in the string", ({ count }) => {
      expect(
        create(
          <I18n
            pt={{
              0: "Zero artigos",
              1: "Um artigo",
              2: "Dois artigos",
              n: "Vários artigos",
            }}
            en={{
              0: "Zero articles",
              1: "One article",
              2: "Two articles",
              n: "Many articles",
            }}
            count={Number(count)}
          />,
        ).toJSON(),
      ).toMatchSnapshot()
    })
  })

  describe("when passing strings with placeholders", () => {
    it.each`
      count
      ${"0"}
      ${"1"}
      ${"2"}
      ${"42"}
    `("renders string with substitutes on $count messages", ({ count }) => {
      expect(
        create(
          <I18n
            pt="Olá, {{name}}. Tem {{count}} mensagens."
            en="Hi, {{name}}. You have {{count}} messages."
            params={{
              name: "John Doe",
              count,
            }}
          />,
        ).toJSON(),
      ).toMatchSnapshot()
    })
  })

  describe("when passing strings with placeholders", () => {
    it.each`
      count
      ${"0"}
      ${"1"}
      ${"2"}
      ${"42"}
    `("renders string with substitutes", ({ count }) => {
      expect(
        create(
          <I18n
            pt={{
              0: "Olá, {{name}}. Não tem mensagens.",
              1: "Olá, {{name}}. Tem {{count}} mensagem.",
              n: "Olá, {{name}}. Tem {{count}} mensagens.",
            }}
            en={{
              0: "Hi, {{name}}. You have no messages.",
              1: "Hi, {{name}}. You have {{count}} message.",
              n: "Hi, {{name}}. You have {{count}} messages.",
            }}
            params={{
              name: "John Doe",
              count,
            }}
            count={Number(count)}
          />,
        ).toJSON(),
      ).toMatchSnapshot()
    })
  })

  describe("when passing function and elements as placeholders", () => {
    it("renders string with right substitutes", () => {
      i18n.locale = undefined

      expect(
        create(
          <I18n
            en={
              'Hi, {{uppercase name.first}}. See your <link>messages</link> of <b>{{today "m/d/Y"}}</b>'
            }
            pt={
              'Olá {{name.first}}. Acesse suas <link>mensagens</link> do dia <b>{{today "d/m/Y"}}</b>'
            }
            params={{
              name: {
                first: "Jane",
                last: "Does",
              },
              link: <a href="/messages" />,
              b: <strong />,
              uppercase: (value: string) => {
                return value.toUpperCase()
              },
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
            }}
          />,
        ).toJSON(),
      ).toMatchSnapshot()

      expect(
        create(
          <I18n
            en="How did that happen? Maybe <0>this route</0> was valid in a point of time or the <1>matrix</1> had a glitch. Anyway, you can go back to our <2>homepage</2> to save the day."
            pt="Como é que isto aconteceu? É provável que <0>esta rota</0> tenha já existido algures no tempo ou então aconteceu um erro na <1>Matrix</1>. Seja como for, poderá voltar para a <2>homepage</2> e salvar o dia!"
            params={{
              0: <a href="/this-route" className="font-bold" />,
              1: <a href="/matrix" className="font-bold" />,
              2: <a href="/" className="font-bold" />,
            }}
          />,
        ).toJSON(),
      ).toMatchSnapshot()
    })
  })
})
