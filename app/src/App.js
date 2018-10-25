import React, { Component, Fragment } from 'react';
import './App.css';
import TokenManagerContract from './services/tokenManager';
import token from './tokens/20Scoops';
import {
  Container,
  Button,
  Input,
  Icon,
  Image,
  Card,
  Message
} from 'semantic-ui-react';

const { web3 } = window;

class App extends Component {
  state = {
    account: '',
    token: null,
    isLoading: false,
    address: '',
    amountToken: '',
    messageError: ''
  };

  componentDidMount() {
    TokenManagerContract.setNetwork('1234567');
    this.tokenManager = TokenManagerContract.TokenManager();
    const account = web3.eth.defaultAccount;
    this.setState({ account });
    this.loadBalanceToken(account);
    this.tokenManager.allEvents((err, response) => {
      if (!err) {
        if (response.event === 'TransferSuccessful') {
          this.loadBalanceToken(this.state.account);
        }
      } else {
        // TODO: something get balance error
      }
    });
  }

  loadBalanceToken = account => {
    let contract = web3.eth.contract(token.abi);
    let erc20Token = contract.at(token.address);
    erc20Token.balanceOf(account, (err, response) => {
      if (!err) {
        let decimal = token.decimal;
        let precision = '1e' + decimal;
        let balance = response.c[0] / precision;
        let name = token.name;
        let symbol = token.symbol;
        let icon = token.icon;
        let abi = token.abi;
        let address = token.address;
        balance = balance >= 0 ? balance : 0;
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
    });
  };

  onAddressChange = event => {
    this.setState({ address: event.target.value, messageError: '' });
  };

  onAmountTokenChange = event => {
    this.setState({ amountToken: event.target.value, messageError: '' });
  };

  Transfer = () => {
    if (!this.state.amountToken || !this.state.address) {
      this.setState({ messageError: 'require amount token and address' });
      return;
    }
    this.setState({ isLoading: true });
    const token = this.state.token;
    let contract = web3.eth.contract(token.abi).at(token.address);
    let amount = `${this.state.amountToken}e${token.decimal}`;
    let receiver = this.state.address;

    amount = new web3.BigNumber(amount).toNumber();

    contract.approve(
      TokenManagerContract.getAddress(),
      amount,
      (err, response) => {
        if (!err) {
          this.tokenManager.transferTokens(
            receiver,
            amount,
            (err, response) => {
              if (!err) {
                this.setState({
                  isLoading: false,
                  amountToken: '',
                  address: ''
                });
              } else {
                this.setState({
                  isLoading: false,
                  amountToken: '',
                  address: '',
                  messageError: err.message
                });
              }
            }
          );
        } else {
          this.setState({
            isLoading: false,
            amountToken: '',
            address: '',
            messageError: err.message
          });
        }
      }
    );
  };

  render() {
    const token = this.state.token;
    return (
      <div className="App">
        <Fragment>
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"
          />
          <Container>
            <div style={{ width: '100%', textAlign: 'center' }}>
              <Message
                style={{ margin: '16px' }}
                negative
                hidden={!this.state.messageError}
              >
                <Message.Header>Oops! Something went wrong</Message.Header>
                <Message.Content>{this.state.messageError}</Message.Content>
              </Message>
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
                        {token.balance.toFixed(3)}{' '}
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
                      onChange={this.onAmountTokenChange}
                      style={{ width: '72%', marginTop: '16px' }}
                      label={{ basic: true, content: token.symbol }}
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
