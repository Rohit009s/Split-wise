
# DEPT simplifier front-end

**Project Link:** [View Project](https://nextwork.ai/projects/58805374-f60d-4b21-93ac-0de18611c060)

**Author:** Neelam Rohith  
**Email:** rohithneelam87@gmail.com

---

![Image](https://nextwork.ai/restful_teal_vibrant_lobster/uploads/58805374-f60d-4b21-93ac-0de18611c060_u4mddw9w)

## The Vision: Bringing a Powerful Backend to Real Users

### Project goals and motivation

In this project, I'm building Dept simplification web application ... so that... easy group spilt trancasaction minimal and easy for everyone.

## Scaffolding the React App with Vite and Tailwind CSS

### Setting up the development environment

In this step, I'm setting up a React project with vite and css... so that I can...build a centralised API service module that talks to your AWS backend

![Image](https://nextwork.ai/restful_teal_vibrant_lobster/uploads/58805374-f60d-4b21-93ac-0de18611c060_knyhxa7q)

### Centralizing API logic in a service module

The API service module centralizes all of your frontend's communication with your AWS backend by wrapping raw network requests into clean, reusable JavaScript functions. ... This is useful because...it keeps your code clean and organized. By storing all requests in api.js, your React components can focus purely on the UI. Plus, if a backend endpoint or URL ever changes, you only have to update it in one central place instead of editing multiple files.

## Building the Group Creation Flow

### Connecting the frontend to the live AWS API

In this step, I'm building Group Form and group view components ... so that users can ... give the inputs validations and displays the created group and its members

![Image](https://nextwork.ai/restful_teal_vibrant_lobster/uploads/58805374-f60d-4b21-93ac-0de18611c060_kwjqrn1l)

### Tracing the Create Group flow through state and API

When I click Create Group, the handleSubmit function... the handleSubmit function in the GroupForm component runs, gathers your input data (group name and members), and triggers the callback prop. then the API ... service function (createGroup in api.js) is called, sending an asynchronous HTTP POST request to your live API Gateway to create and save the new group in DynamoDB. then the state...nside App.jsx (the group state) is updated with the successful response data using setGroup(groupData).Finally... React detects this state change, triggers a re-render, and conditionally switches from showing GroupForm to showing GroupView because the group state is no longer null.

## Logging Expenses Across Group Members

### Building the core data-entry experience

In this step, I'm building the components od ExpenseForm abd ExpensList ... so that users can...submit their expenses to API and fetches and displays the expenses

![Image](https://nextwork.ai/restful_teal_vibrant_lobster/uploads/58805374-f60d-4b21-93ac-0de18611c060_e4h9tcdv)

### How the expense list stays in sync with the API

The ExpenseList re-fetches because... it uses a useEffect hook with [groupId, refreshKey] in its dependency array. Whenever a user adds a new expense, the parent component (GroupView) increments the refreshKey prop. This change automatically triggers the hook to execute and fetch the updated expenses from your AWS backend.

## Revealing the Algorithm: Simplified Settlements

### The payoff moment — messy expenses become clean transfers

In this step, I'm building the settlemenrs component and displaying simplified transaction cards showing who pays whom... so that users can...with a single transaction settle up button calls

![Image](https://nextwork.ai/restful_teal_vibrant_lobster/uploads/58805374-f60d-4b21-93ac-0de18611c060_awt77p5e)

### Measuring the algorithm's simplification power

I entered 3 expenses which are food train and stay... expenses and the algorithm simplified them to 2 expenses and single transaction per person 

## Deploying Globally on Vercel with Automatic CI/CD

### From local dev to a live public URL

In this step, I'm deploying the project into Vercel. Initially we are going to put the project into git... so that... function as this project's Vercel hosting

### Live URL and CI/CD confirmation

My Vercel URL is https://split-wise-olive.vercel.app/ ... I confirmed CI/CD works by pushing edited file from the project ... and seeing the changes in the deployed vercel dashboard ...

## Secret Mission: Animated Debt Simplification Visualization


### Making the algorithm transparent and educational

In this project extension, I created a step-by-step animation that reveals every transaction which is required for next user to pay and who paid and who is going to pay whom ?...

## Reflections and Key Takeaways

### Tools and concepts mastered

The key tools I used include React & Vite, Tailwind CSS & Git ... Key concepts I learnt include State Orchestration , Client-Server Integration , CORS Resolution and Automated CI/CD...

### Time and challenges

This project took me approximately 9 hours to complete. The most challenging part was orchestrating the play/pause sequential state transitions inside the React hooks loop while ensuring clean memory execution.

### Looking ahead

"I did this project today to learn how to securely connect an interactive React client with an AWS Serverless backend and host it on Vercel. Another skill I want to learn is system design patterns for microservices, caching, and scalable database architectures

---

*Built with [NextWork](https://nextwork.ai) - [View this project](https://nextwork.ai/projects/58805374-f60d-4b21-93ac-0de18611c060)*
