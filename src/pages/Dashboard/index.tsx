import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { IoIosArrowDown } from 'react-icons/io';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import homeImg from '../../assets/house.svg';
import foodImg from '../../assets/food.svg';
import moneyImg from '../../assets/money.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

interface ResponseData {
  transactions: Transaction[];
  balance: Balance;
}

interface Map<T> {
  [K: string]: T;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);
  const icons: Map<string> = {
    Alimentação: foodImg,
    Casa: homeImg,
    Venda: moneyImg,
    default: moneyImg,
  };

  function getCategoryIcon(category: string): string {
    return icons[category] || icons.default;
  }

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get<ResponseData>('transactions');

      const transactionData = response.data.transactions;
      const balanceData = response.data.balance;

      const formattedTransactions = transactionData.map(transaction => ({
        ...transaction,
        formattedValue: formatValue(transaction.value),
        formattedDate: format(new Date(transaction.created_at), 'dd/MM/yyyy'),
      }));

      const formattedBalance = {
        income: formatValue(parseFloat(balanceData.income)),
        outcome: formatValue(parseFloat(balanceData.outcome)),
        total: formatValue(parseFloat(balanceData.total)),
      };

      setBalance(formattedBalance);
      setTransactions(formattedTransactions);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>
                  <span>
                    <p>Título</p>
                    <IoIosArrowDown />
                  </span>
                </th>
                <th>
                  <span>
                    <p>Preço</p>
                    <IoIosArrowDown />
                  </span>
                </th>
                <th>
                  <span>
                    <p>Categoria</p>
                    <IoIosArrowDown />
                  </span>
                </th>
                <th>
                  <span>
                    <p>Data</p>
                    <IoIosArrowDown />
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {transaction.type === 'outcome' && '-'}{' '}
                    {transaction.formattedValue}
                  </td>
                  <td>
                    <span>
                      <img
                        src={getCategoryIcon(transaction.category.title)}
                        alt="category"
                      />{' '}
                      {transaction.category.title}
                    </span>
                  </td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
