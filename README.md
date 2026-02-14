# 🚀 Playwright TS BDD Automation Framework

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript&style=for-the-badge)
![Playwright](https://img.shields.io/badge/Playwright-Automation-green?logo=playwright&style=for-the-badge)
![BDD](https://img.shields.io/badge/Cucumber-BDD-brightgreen?logo=cucumber&style=for-the-badge)
![Reporting](https://img.shields.io/badge/Reporting-Allure-orange?logo=allure&style=for-the-badge)
![CI/CD Ready](https://img.shields.io/badge/CI%2FCD-Ready-purple?logo=jenkins&style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-lightgrey?logo=open-source-initiative&style=for-the-badge)

---

## 🌟 Scalable End-to-End Test Automation Framework

Built using **Playwright + TypeScript + Cucumber BDD + Allure Reporting**

---

## 📌 Overview

This framework provides an **enterprise-ready automation solution** supporting:

- 🌐 UI Testing  
- 🔌 API Testing  
- 🗄 Database Validation  
- 🔄 End-to-End Workflow Testing  
- 🧪 Behavior Driven Development (BDD)  

It is designed to be **scalable, maintainable, and CI/CD friendly**, enabling teams to implement robust automation strategies across multiple environments and browsers.

---

## ✨ Key Features

- UI Automation  
- API Testing  
- Database Validation  
- End-to-End Testing  
- Cross Browser Testing  
- Multi Environment Support  
- Parallel Execution  
- Shadow DOM Handling  
- Soft Assertions  
- Structured Logging  
- BDD Scenario Writing  
- CI/CD Integration  
- Rich Reporting Dashboard  

---

## 🧱 Tech Stack

| Technology | Usage |
|-------------|-------------|
| Playwright | UI & E2E automation |
| TypeScript | Type safety & clean architecture |
| Cucumber | BDD scenario design |
| Allure | Advanced reporting & analytics |
| PostgreSQL | Database validation |
| Node.js | Runtime execution |

---

## 🏗️ Framework Architecture

```
Feature Files (BDD)
        ↓
Step Definitions
        ↓
Page Object Model
        ↓
UI / API / DB Utilities
        ↓
Hooks Layer
        ↓
Reporting
```

---

## 🗂️ Project Structure

```
Playwright_TS_BDD_Framework
│
├── src
│   ├── api
│   ├── config
│   ├── db
│   ├── hooks
│   ├── pages
│   ├── utils
│
├── features
│   ├── authentication
│
├── tests
│   └── runner
│
├── playwright.config.ts
├── cucumber.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## ⚙️ Prerequisites

- Node.js ≥ 18
- npm or yarn
- PostgreSQL (optional)

---

## 🛠️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd Playwright_TS_BDD_Framework
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Install Playwright Browsers

```bash
npx playwright install
```

---

## 🌍 Environment Configuration

Environment configs located in:

```
src/config
```

Supported environments:

```
dev
qa
uat
prod
```

Run tests in environment:

```bash
ENV=qa npm run test
```

---

## ▶️ Test Execution

### Run BDD Tests

```bash
npm run bdd
```

---

### Run Playwright Tests

```bash
npm run test
```

---

### Run In Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

---

## ⚡ Parallel Execution

Parallel workers configured in:

```
playwright.config.ts
```

---

## 🧪 Writing Tests

### Feature File Example

```
Feature: Login

Scenario: Successful Login
  Given user is on login page
  When user logs in
  Then user should see dashboard
```

---

### Step Definition Example

```ts
Given('user is on login page', async () => {
   await loginPage.navigate();
});
```

---

### Page Object Example

```ts
class LoginPage {
   async navigate() {}
   async login() {}
}
```

---

## 📊 Reporting

### Generate Allure Report

```bash
npx allure generate allure-results --clean
```

---

### Open Report

```bash
npx allure open
```

---

### Report Includes

- Execution Dashboard
- Step Logs
- Screenshots
- Failure Trace
- Trend Analytics
- Environment Details

---

## 🧬 Database Testing

Located in:

```
src/db
```

Supports:

- Data validation
- Query execution
- Test data verification

---

## 🔌 API Testing

Located in:

```
src/api
```

Supports:

- REST validation
- Response assertions
- Request logging
- Payload validation

---

## 🧩 Hooks

Located in:

```
src/hooks
```

Handles:

- Browser lifecycle
- Scenario setup & teardown
- Reporting attachments
- Environment initialization

---

## 🧵 Multi Browser Support

- Chromium
- Firefox
- WebKit

---

## ⚡ CI/CD Integration

Supports execution using:

- Jenkins
- GitHub Actions
- Other CI tools

---

## 📈 Future Enhancements

- Visual testing integration
- Performance testing hooks
- Cloud execution support
- Slack/Teams notifications
- Analytics dashboards

---

## 🧹 Best Practices Implemented

- Page Object Model
- BDD Driven Development
- Reusable Utilities
- Environment Driven Execution
- Modular Architecture

---

## 🤝 Contribution

```
Fork → Create Branch → Commit → Pull Request
```

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Vikash Singh  
Automation Engineer | QA Architect

---

⭐ If you find this framework useful, consider starring the repository!