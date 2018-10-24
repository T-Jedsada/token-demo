import React, { Component, Fragment } from 'react';
import './App.css';
import TokenManagerContract from './services/tokenManager';
import token from './tokens/20Scoops';
import { Container, Button, Input, Icon, Image, Card } from 'semantic-ui-react';

const { web3 } = window;

class App extends Component {
  state = {
    account: '',
    token: null,
    isLoading: false,
    address: '',
    amountToken: ''
  };

  loadBalanceToken = account => {
    let contract = web3.eth.contract(token.abi);
    let erc20Token = contract.at(token.address);

    erc20Token.balanceOf(account, (err, response) => {
      console.log('err: ', err);
      console.log('response: ', response);
      if (!err) {
        let decimal = token.decimal;
        let balance = response.c[0];
        let name = token.name;
        let symbol = token.symbol;
        let icon = token.icon;
        let abi = token.abi;
        let address = token.address;

        balance = balance >= 0 ? balance : 0;

        if (balance > 0) {
          this.setState({
            token: {
              decimal,
              balance,
              name,
              symbol,
              icon,
              abi,
              address
            }
          });
        }
      }
    });
  };

  componentDidMount() {
    TokenManagerContract.setNetwork('1540388236758');
    this.tokenManager = TokenManagerContract.TokenManager();
    const account = web3.eth.defaultAccount;
    this.setState({ account });
    this.loadBalanceToken(account);
  }

  onAddressChange = event => {
    this.setState({ address: event.target.value });
  };

  onTokenChange = event => {
    this.setState({ amountToken: event.target.value });
  };

  Transfer = () => {
    this.setState({ isLoading: true });
    const token = this.state.token;
    let contract = web3.eth.contract(token.abi).at(token.address);
    let amount = `${this.state.amountToken}e${token.decimal}`;
    let receiver = this.state.address;

    amount = new web3.BigNumber(amount).toNumber();

    contract.approve(
      '0x3d79faf4d165f7fcd5f4f0186fcab44dc7c7f6ea',
      amount,
      (err, response) => {
        if (!err) {
          this.tokenManager.transferTokens(
            receiver,
            amount,
            (err, response) => {
              this.setState({ isLoading: false, amountToken: '', address: '' });
              console.log('error: ', err);
              console.log('response: ', response);
            }
          );
        } else {
          this.setState({ isLoading: false, amountToken: '', address: '' });
          console.log(err);
        }
      }
    );
  };

  render() {
    const token = this.state.token;
    if (token != null) {
      console.log('POND', token.balance);
    }
    return (
      <div className="App">
        <Fragment>
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"
          />
          <Container>
            <div style={{ width: '100%', textAlign: 'center' }}>
              <Card className="center" style={{ width: '552px' }}>
                {token === null ? (
                  <div>Loading...</div>
                ) : (
                  <div style={{ margin: '16px', width: '100%' }}>
                    <h3>Balance</h3>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Image
                        style={{ marginRigth: '16px' }}
                        circular
                        src={token.icon}
                        className="token-icon"
                      />
                      <h4 style={{ marginTop: '8px', marginLeft: '6px' }}>
                        {' '}
                        {token.balance}{' '}
                      </h4>
                      <h4 style={{ marginTop: '8px', marginLeft: '6px' }}>
                        {' '}
                        {token.symbol}
                      </h4>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                      <Input
                        value={this.state.address}
                        onChange={this.onAddressChange}
                        style={{ width: '72%' }}
                        iconPosition="left"
                        placeholder="Address"
                      >
                        <Icon name="address card" />
                        <input />
                      </Input>
                    </div>
                    <Input
                      value={this.state.amountToken}
                      onChange={this.onTokenChange}
                      style={{ width: '72%', marginTop: '16px' }}
                      label={{ basic: true, content: 'SC' }}
                      labelPosition="right"
                      placeholder="Amount"
                    />
                    <div style={{ margin: '16px' }}>
                      <Button
                        loading={this.state.isLoading}
                        style={{ width: '50%' }}
                        primary
                        positive
                        onClick={this.Transfer}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </Container>
        </Fragment>
      </div>
    );
  }
}

export default App;
