import { Given, Then, When, setDefaultTimeout } from '@cucumber/cucumber';
import { LoginPage } from '../../src/pages/LoginPage';
import { testContext } from '../../src/fixture/testContext';
import { ENV } from '../../config/env/env';


const login = () => new LoginPage(testContext.page);

Given('user is on login page', async () => {
  console.log('Navigating to:', ENV.BASE_URL);
  await login().navigate(ENV.BASE_URL);
});

When('user logs in', async () => {
  console.log('Attempting to login...');
  await login().login('test_email_admin@email.com','123456');
});

Then('user verifies the login', async () => {
    await login().validateLogin()
})