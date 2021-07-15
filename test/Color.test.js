const Color = artifacts.require("./Color")

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Color', (accounts) => {
  let contract

  before(async () => {
    contract = await Color.deployed()
  })

  describe('deplyment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address

      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has name', async () => {
      const name = await contract.name()
      assert.equal(name, "Color")
    })

    it('has symbol', async () => {
      const symbol = await contract.symbol()
      assert.equal(symbol, "COLOR")
    })

  })
})