import config from '../config';
import { USER_ROLE } from '../modules/auth/const.auth';
import { User } from '../modules/auth/model.auth';

const superUser = {
  username: 'superAdmin',
  email: config.super_admin_email,
  password: config.super_admin_pass,
  role: USER_ROLE.superAdmin,
};

const seedSuperAdmin = async () => {
  //when database is connected, we will check is there any user who is super admin
  const isSuperAdminExits = await User.findOne({ role: USER_ROLE.superAdmin });

  if (!isSuperAdminExits) {
    await User.create(superUser);
  }
};

export default seedSuperAdmin;
