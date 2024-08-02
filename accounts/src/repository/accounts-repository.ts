import { injectable } from "tsyringe";
import { Account } from "../models/model";

const accounts: Account[] = [
  { Name: 'omid', UserId: 'Xu_UhgN_a', Email: 'user1@gmail.com', Password: 'password' },
  { Name: 'adrian', UserId: 'HJ-HnhYul_sm', Email: 'user2@gmail.com', Password: 'password' },
  { Name: 'john', UserId: 'Vnmq_azY_Q', Email: 'user3@gmail.com', Password: 'password' },
  { Name: 'sara', UserId: 'hYJNB-Oul_sm', Email: 'user4@gmail.com', Password: 'password' },
  { Name: 'edouard', UserId: 'mwTgFDsZa_n', Email: 'user5@gmail.com', Password: 'password' },
  { Name: 'james', UserId: 'Zamw_nTDsgF', Email: 'user6@gmail.com', Password: 'password' }
];

@injectable()
export class AccountsRepository {
    async getAccounts(filters: Partial<Account>): Promise<Account[]> {
      if(filters) {
        const { Email, UserId, Name, Password  } = filters;
        return await Promise.resolve(accounts.filter(
          account => 
            (!Email || account.Email.toLowerCase() === Email.toLowerCase()) &&
            (!UserId || account.UserId.toLowerCase() === UserId.toLowerCase()) &&
            (!Name || account.Name.toLowerCase() === Name.toLowerCase()) &&
            (!Password || account.Name.toLowerCase() === Password.toLowerCase())
        ));
      }
      return await Promise.resolve(accounts);
    }
}