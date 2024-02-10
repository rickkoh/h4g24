# BotaniQ: Integrated Form Analysis and Managment System 🥬🌲💚
Overview
BotaniQ aims to provide a user-friendly interface for GUI to manage their programs and activities, while facilitating a streamlined process for collecting, analysing and interpreting data from diverse feedback channels with regards to their sustainability efforts. Beyond mere data management, BotaniQ integrates analytics tools that automatically process and visualise the data, highlighting key trends, patterns and insights. It utilises on sophisticated Artificial Intelligence (AI) to provide three forms of analysis - Sentimental, Summary and Keyword. Ultimately, BotaniQ aims to transform the way GUI manages its sustainability programs and activities by empowering data-drive decisions that amplify the impact of their work, fostering a more sustainable future through informed and strategic action.

### Key Features
1. **AI Driven Analysis**: Sift through and interpret large datasets collected from various forms. Identifies patterns and trends, offering predictive insights for future efforts. Automates the analysis process for accruate and actionable decision making.
2. **Streamlined Management and Evaluation of Sustainability Efforts**: Organises and tracks the programs and activities of GUI efficiently. Facilitates the easy monitoring of progress and impact measurement through an organised and user-friendly dashboard.
3. **Integrated Form Management Platform**: Centralises data collection from various forms and surveys. Simplifies information gathering across multiple sources through the use of charting for visualisation of data.


### Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

#### Prerequisites
- Git
- Node.js (version 14.x or later recommended)
- npm (version 6.x or later recommended)

#### Installation Guide
1. Clone the Repository
Use Git to clone the BotaniQ repository to your local machine
```bash
git clone https://github.com/rickkoh/h4g24.git
```

2. Install Dependencies
Navigate to the project directory and install the necessary dependencies:
```bash
cd h4g24
npm install
```

3. Configure Environment
This will require a .env.local file in the root directory which contains the Supabase keys required to connect to the backend

4. Launch the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

#### How to Use
**Create an account and Login** <br>
Register for an account using the Sign Up page. You will receive a verification email by Supabase to register as a user. This simulates creating an admin user. Note that the sign up process will be restricted to GUI admins. Once verified, you can login to the admin portal

**Create Programs** <br>
Create GUI programs under the programs page. Programs can be linked to any existing activities

**Create Activities** <br>
Create GUI activities under the activities page. Programs can be linked to any existing forms/surveys

**Import Survey Responses** <br>
Import a CSV file that contains the responses from a survey. Note that we only currently support Google Forms (since that is the primary mode of survey used by GUI for now). Once imported, you will be able to review all responses and questions. Our algorithm will automatically detect the question type if there is sufficient data. Select the question analysis type to choose what kind of analysis should be performed on the question and its responses. Once selected, import the data.

**Viewing survey analysis** <br>
Click on the individual surveys in the surveys table to view more analytics of the specified survey. This includes chart representation of the survey responses as well as interpretation.


### Tech Stack
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-green.svg?logo=supabase&logoColor=grey&style=for-the-badge)
![OpenAI](https://img.shields.io/badge/OpenAI-grey.svg?logo=openAI&logoColor=darkGreen&style=for-the-badge)
![AntDesign](https://img.shields.io/badge/AntDesign-blue.svg?logo=antdesign&style=for-the-badge)
