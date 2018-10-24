import React, { Component, Fragment } from 'react';
import './App.css';
import TokenManagerContract from './services/tokenManager'
import token from './tokens/20Scoops'
import { Container, Button } from 'semantic-ui-react'

const { web3 } = window;

class App extends Component {

  state = {
    account: '',
    token: null
  };

  loadBalanceToken = (account) => {
    let contract = web3.eth.contract(token.abi);
    let erc20Token = contract.at(token.address);

    erc20Token.balanceOf(account, (err, response) => {
        console.log('err: ', err)
        console.log('response: ', response)
        if(!err) {
            let decimal = token.decimal;
            let balance = response.c[0];
            let name = token.name;
            let symbol = token.symbol;
            let icon = token.icon;
            let abi = token.abi;
            let address = token.address;

            balance = balance >= 0 ? balance : 0;

            if(balance > 0) {
              this.setState({ token: {
                  decimal,
                  balance,
                  name,
                  symbol,
                  icon,
                  abi,
                  address,
                }
              })
            }
        }
    });
  }

  componentDidMount() {
    TokenManagerContract.setNetwork('1540364383560')
    this.tokenManager = TokenManagerContract.TokenManager()
    this.tokenManager.addNewToken('SC', '0x6e72f9754b049eca4a826a0862aa52ccac197262', (err, response) => {
      console.log('error add new token: ', err)
      console.log('response add new token: ', response)
    })
    const account = web3.eth.defaultAccount
    this.setState({ account })
    this.loadBalanceToken(account)
  }

  Transfer = () => {
    const token = this.state.token
    let contract = web3.eth.contract(token.abi).at(token.address)
    let amount = 5  + 'e' + token.decimal
    let symbol = token.symbol;
    let receiver = '0x8A86D78448217eC0dFa092Fd7a702b7017e3Da3B';

    amount = new web3.BigNumber(amount).toNumber();

    contract.approve('0xdd38f6a2311cb27ebedc917357806a780c7f1b08', amount, (err, response) => {
        if(!err) {
          this.tokenManager.transferTokens(symbol, receiver, amount, (err, response) => {
              console.log('error: ', err)
              console.log('response: ', response)
          })
        } else {
            console.log(err);
        }
    });
  }

  render() {
    const token = this.state.token
    if (token != null) {
      console.log('POND', token.balance)
    }
    return (
      <div className="App">
        <Fragment>
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"
          />
          <Container>
            { 
              token === null ? <div>Loading...</div> :
              <div style={{margin: '16px'}}>
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                  <img alt={token.symbol} src={token.icon} className='token-icon'/>
                  <p style={{ marginTop: '4px', marginLeft: '6px'}}> {token.balance} </p>
                  <p style={{ marginTop: '4px', marginLeft: '6px'}}> {token.symbol}</p>
                </div>
                <div> <Button onClick={this.Transfer}> Send </Button> </div>
              </div>
            }
          </Container>
        </Fragment>
      </div>
    );
  }
}

export default App;