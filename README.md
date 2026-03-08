# Eppoi - SPM project

A Progressive Web App meant to help tourists to visit the beautiful holiday resort of Cupra Marittima. Gives hints based on user preferences and their geolocation and provides AI support. It is also designed to work offline to support tourists while they are travelling without available connection. 

## Developers
| Name                     | Role & Responsibility                                   | Email                                 |
|:-------------------------|:--------------------------------------------------------|:--------------------------------------|
| **Bianca Maria Cerino** | Backend development, database architect, data ingestion | biancamaria.cerino@studenti.unicam.it |
| **Rut Bastoni**          | UI design, frontend development, AI integration         | rut.bastoni@studenti.unicam.it        |

## Built with
| Tier                    | Implementation                               |
|:------------------------|:---------------------------------------------|
| **Backend**             | .NET 9                                       |
| **Frontend**            | React + Vite, Tailwind                       |
| **Database**            | SQL Server Express                           |
| **AI Integration**      | Google Gemini APIs (FileSearchStore for RAG) |
| **Unit Testing**        | NUnit, Moq (backend), Vitest (frontend)      |
| **Integration Testing** | Vitest (frontend)                            |
| **E2e Testing**         | Playwright (frontend)                        |

## Running instuctions

### Prerequisites
* Visual Studio with .NET SDK 9, SQL Server Express (Visual Studio bundled one or another instance)
* Google AI Studio API key (also free tier, but with usage limitations)
* Google FileSearchstore of Gemini APIs created and its identifier available
* Google Oauth client credentials configured to run in localhost
* Facebook Api Key of configured login application
* Smtp service of your choice parameter (to send mails to user)

### Setup
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/SPM-25-26/BMR_SPM
    cd DFR
    ```
2.  **Open project and configure secrets:** Open the Update `BMR_SPM.sln` solution with Visual Studio, in solutions explorer expand `eppoi.`, then `Connected Services`, and edit `Secrets.json` by providing DB connection strings, Google and Facebook credentials, SMTP service configuration, and Google Gemini API key.
3.  **Initialize Database and ingest data:**
    In `Packages manager console`, run:
    ```bash
    Update-Database
    ```
    Then select, as a starting project, `Eppoi.Console`. Run the console and type `I` to ingest data from sample APIs into your database.
4.  **Initialize AI store for grounding:**
    With your Google AI studio api key, call Gemini APIs to create a FileSearchstore (see Google documentation), then configure its identifier into server secrets. Run again the `Console` solution, type 'G' to send ragdata to Filesearchstore with Gemini APIs.  
5.  **Run the App (development mode):**
    Install npm modules for frontend:
    ```bash
    cd eppoi.client
    npm install
    ```
    From Visual studio, select the `Server+Client` profile and run the application.
6.  **Run the App (production mode, to test PWA offline features):**
    Select the `eppoi.Server` profile and run the backend. Then, from console:
    ```bash
    cd eppoi.client
    npm run build
    npm run preview
    ```
7.  **Run backend unit tests:**
    In Visual Studio, from `Test` menu select `Test explorer`, select `Eppoi.Server.Tests`, then click on `Run`.
8.  **Run frontend unit tests:**
    From console:
    ```bash
    cd eppoi.client
    npm run test 
    ```    
    To run while developing, `npm run test:watch` runs continuously while changing source code.
9. **Run frontend integration tests:**
   Run the application and login. Open browser developer tools and copy, from localStorage, the authentication token, then open file `run-integration-tests.ps1` and update `INTEGRATION_AUTH_TOKEN` variable with it. 
   Then, from Powershell console:
    ```bash
    cd eppoi.client
    .\scripts\run-integration-tests.ps1
    ```
   Please note that the token expires after some minutes; this is just for demo purposes, but should be made better with automatic authentication scripts and a sample seeded database.
10. **Run frontend e2e tests:**
    ```bash
    cd eppoi.client
    npm run test:e2e:ui
    ```
    This will run Playwright tests; one can also setup headless or headed mode (instead of ui) for CI with Github workflows.
   