/* eslint-env jest */
import '@testing-library/jest-dom'
import { render } from '@testing-library/react';
import App from './App';
import Login from './modules/login/Login';
test('renders learn react link', () => {
  render(<App />);
  expect(<Login />).toBeInTheDocument();
});

export { };
