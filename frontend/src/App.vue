<template>
  <div
    v-if="!loading"
    id="app">
    <header>
      <h1>NFT DAPP</h1>
      account: {{ account }}
    </header>
    <section>
      <h2>Select Color</h2>
      <div class="color-select">
        <input
          class="color-input"
          type="color"
          v-model="selectedColor">
        <button class="color-submit" @click="mint">MINT</button>
        <div>{{ selectedColor }}</div>
      </div>
    </section>
    <section>
      <h2>Color Tokens</h2>
      <div
        class="color-list"
        v-for="color in colors"
        :key="color">
        <div class="color">
          <div
            class="color-sample"
            :style="`background: ${color}`"/>
          <div class="color-code">
            {{ color }}
          </div>
        </div>
      </div>
    </section>
  </div>
  <div v-else>
    Loading
  </div>
</template>

<script>
  import Web3 from "web3"
  import Color from './contracts/Color.json'

  export default {
    name: 'app',
    data () {
      return {
        account: '',
        loading: true,
        contract: null,
        colors: [],
        colorCount: null,
        selectedColor: null,
        web3: undefined,
      }
    },
    async mounted () {
      await this.loadBlockchainData()
    },
    methods: {
      async loadBlockchainData () {
        if (typeof window.ethereum !== 'undefined') {
          this.web3 = new Web3(window.ethereum)
          const netId = await this.web3.eth.net.getId()
          const accounts = await this.web3.eth.getAccounts()
          this.account = accounts[0]

          //load balance
          if (typeof accounts[0] !== 'undefined') {
            this.balance = await this.web3.eth.getBalance(accounts[0])
          } else {
            window.alert('Please login with MetaMask')
          }

          //load contracts
          try {
            this.contract = new this.web3.eth.Contract(Color.abi, Color.networks[netId].address)

            this.colorCount = parseInt(await this.contract.methods.totalSupply().call())

            for (var i = 1; i <= this.colorCount; i++) {
              const color = await this.contract.methods.colors(i - 1).call()
              this.colors.push(color)
            }
            this.loading = false

          } catch (e) {
            /* eslint-disable no-console*/
            console.log('Error', e)
            window.alert('Contracts not deployed to the current network')
          }
        } else {
          window.alert('Please install MetaMask')
        }
      },

      mint () {
        this.loading = true
        this.contract.methods
          .mint(this.selectedColor)
          .send({ from: this.account })
          .once('receipt', () => {
            this.colors.push(this.selectedColor)
            this.selectedColor = null
            this.loading = false
          })
      },
    },
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;

  }

  .color-list {
    width: 100%;
  }

  .color {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 20px;
  }

  .color-sample {
    width: 60px;
    height: 60px;
    border-radius: 50%
  }

  .color-input {
    width: 41px;
    height: 41px;
    margin: 0 8px 0 0;
    padding: 0;
    cursor: pointer;
  }

  .color-select {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .color-submit {
    margin-right: 8px;
  }

</style>
