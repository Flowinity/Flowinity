const TestSequencer = require("@jest/test-sequencer").default

class CustomSequencer extends TestSequencer {
  // @ts-ignore
  sort(tests) {
    return tests.sort((a: any, b: any) => {
      const categoryOrder = ["auth", "user", "gallery"]

      const categoryA = categoryOrder.find((category) =>
        a.path.includes(category)
      )
      const categoryB = categoryOrder.find((category) =>
        b.path.includes(category)
      )

      if (categoryA && categoryB) {
        const indexA = categoryOrder.indexOf(categoryA)
        const indexB = categoryOrder.indexOf(categoryB)

        return indexA - indexB
      }

      if (categoryA) {
        return -1
      }

      if (categoryB) {
        return 1
      }

      return a.path.localeCompare(b.path)
    })
  }
}

module.exports = CustomSequencer
