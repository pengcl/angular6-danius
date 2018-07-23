import {AuthService} from './auth.service';
import {UserService} from './user.service';
import {OrderService} from './order.service';
import {PayService} from './pay.service';
import {JobService} from './job.service';

export const SERVICES_DECLARATIONS = [
  AuthService,
  UserService,
  OrderService,
  PayService,
  JobService
];
