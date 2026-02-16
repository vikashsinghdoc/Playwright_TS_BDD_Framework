import { Given, When, Then, And } from "../../src/support/frameworkSteps";
import { ENV } from "../../config/env/env";


Given("user is on login page", async function () {
  await this.loginPage.navigate(ENV.BASE_URL);
});

When("user logs in", async function () {
  await this.loginPage.login(
    "test_email_admin@email.com",
    "123456"
  );
});

Then("user verifies the login", async function () {
  await this.loginPage.validateLogin();
});
