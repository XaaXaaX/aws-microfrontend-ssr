import ReactDOMServer from 'react-dom/server';
import { inject, injectable } from 'tsyringe';
import { AccountsRepository } from '../repository/accounts-repository';
import { Account } from '../models/model';
import SignIn from './components/SignInForm';

@injectable()
export class SignInMicroFrontEnd {
  constructor(
    @inject(AccountsRepository) private readonly repository: AccountsRepository) {
  }
  Render = async (filters: Partial<Account>): Promise<string> => {

    const results = await this.repository.getAccounts(filters) || [];
    const params = { 
      Email: filters.Email!, 
      Password: filters.Password!,
      onSubmitForm: (email: string, password: string): boolean => {
        console.log('Sign In', email, password);
        return email === results?.[0]?.Email && password === results?.[0]?.Password; }
    };

    return `<div id="signin">${ReactDOMServer.renderToString(<SignIn authInfo={params} />)}</div>`;
  }
}
