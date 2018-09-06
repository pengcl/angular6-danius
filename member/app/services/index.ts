import {AuthService} from './auth.service';
import {UserService} from './user.service';
import {EmployeeService} from './employee.service';
import {EmployerService} from './employer.service';
import {CompanyService} from './company.service';
import {OrderService} from './order.service';
import {PayService} from './pay.service';
import {JobService} from './job.service';
import {ChatService} from './chat.service';
import {FollowService} from './follow.service';

export const SERVICES_DECLARATIONS = [
  AuthService,
  UserService,
  EmployeeService,
  EmployerService,
  CompanyService,
  OrderService,
  PayService,
  JobService,
  ChatService,
  FollowService
];
