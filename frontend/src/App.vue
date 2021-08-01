<template>
  <div id="app">
    <header>
      <h1>NFT DAPP</h1>
      account: {{ account }}
    </header>
    <div>Color Tokens</div>
    <div class="color-list"
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

    <input type="color" v-model="inputColor">
    <button @click="mint">MINT</button>
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
        inputColor: null,
      }
    },
    async mounted () {
      await this.loadWeb3()
      await this.loadBlockchainData()
    },
    methods: {
      async loadWeb3 () {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        } else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
        } else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      },
      async loadBlockchainData () {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        this.account = accounts[0]

        const networkId = await web3.eth.net.getId()
        const networkdata = Color.networks[networkId]
        if (networkdata) {
          this.contract = new web3.eth.Contract(Color.abi, networkdata.address)
          this.colorCount = parseInt(await this.contract.methods.totalSupply().call())

          for (var i = 1; i <= this.colorCount; i++) {
            const color = await this.contract.methods.colors(i - 1).call()
            this.colors.push(color)
          }

        } else {
          alert('Contract is not deployed on this network')
        }
      },
      mint () {
        this.contract.methods.mint(this.inputColor).send({ from: this.account })
          .once('receipt', () => {
            this.colors.push(this.inputColor)
            this.inputColor = null
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
    margin: 10px;
  }

  .color-sample {
    width: 60px;
    height: 60px;
    border-radius: 50%
  }

</style>
