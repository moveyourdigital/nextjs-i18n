import React from "react"
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

  describe("when passing children", () => {
    it("must throw an error", () => {
      expect(() => create(<I18n>Hello</I18n>)).toThrow(
        "I18n component must not have children",
      )
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
            pt="Olá {{name}}. Acesse suas <link>mensagens</link> do dia <b>{{today locale}}</b>"
            en="Hi, {{name}}. See your <link>messages</link> of <b>{{today locale}}</b>"
            params={{
              name: "Jane Doe",
              link: <a href="/messages" />,
              b: <strong />,
              today: (format: string) => {
                const today = new Date()
                switch (format) {
                  case "locale":
                    return today.toLocaleDateString()
                  default:
                    return today.toDateString()
                }
              },
            }}
          />,
        ).toJSON(),
      ).toMatchSnapshot()
    })
  })
})
